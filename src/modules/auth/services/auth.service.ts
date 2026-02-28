import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User, UserDocument } from '../../users/schemas/user.schema';
import { Agency, AgencyDocument } from '../../agencies/schemas/agency.schema';
import { Plan, PlanDocument } from '../../plans/schemas/plan.schema';
import { UsersService } from '../../users/services/users.service';
import { PlansService } from '../../plans/services/plans.service';

import { 
  RegisterDto, 
  LoginDto, 
  RefreshTokenDto, 
  VerifyEmailDto,
  ResendVerificationDto 
} from '../dto';
import { 
  JwtPayload, 
  RefreshTokenPayload, 
  AuthTokens, 
  UserWithTokens 
} from '../../../shared/interfaces';
import { UserRole, AgencyStatus } from '../../../shared/enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private plansService: PlansService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Agency.name) private agencyModel: Model<AgencyDocument>,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserWithTokens> {
    const {
      agencyName,
      email,
      password,
      adminName,
      phoneNumber,
      whatsappNumber,
      countryCode,
      planId,
      marketingConsent = false,
      source
    } = registerDto;

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Validate plan exists
    const plan = await this.plansService.findById(planId);
    if (!plan) {
      throw new BadRequestException('Invalid plan selected');
    }

    // Create agency
    const demoExpiresAt = new Date();
    demoExpiresAt.setDate(demoExpiresAt.getDate() + 7); // 7 days demo

    const agency = new this.agencyModel({
      name: agencyName,
      email,
      phoneNumber,
      whatsappNumber,
      countryCode,
      planId,
      status: AgencyStatus.DEMO,
      demoExpiresAt,
      marketingConsent,
      source,
      isEmailVerified: false,
      isPhoneVerified: false,
      isWhatsappVerified: false,
    });

    await agency.save();

    // Hash password
    const saltRounds = this.configService.get<number>('app.bcryptRounds');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const user = new this.userModel({
      agencyId: agency._id,
      name: adminName,
      email,
      password: hashedPassword,
      role: UserRole.AGENCY_ADMIN,
      isActive: true,
      tokenVersion: 0,
    });

    await user.save();

    // Generate email verification token
    await this.generateEmailVerificationToken(agency);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store hashed refresh token
    await this.storeRefreshToken(user._id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<UserWithTokens> {
    const { email, password } = loginDto;

    const user = await this.userModel
      .findOne({ email })
      .populate('agencyId')
      .exec();

    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Check agency access
    const agency = user.agencyId as any;
    if (!agency.canAccess()) {
      if (agency.isDemoExpired()) {
        throw new UnauthorizedException('Demo period expired. Please upgrade your subscription.');
      }
      throw new UnauthorizedException('Agency account suspended');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store hashed refresh token
    await this.storeRefreshToken(user._id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      const user = await this.userModel
        .findById(payload.sub)
        .populate('agencyId')
        .exec();

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Verify token version (for token invalidation)
      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token has been invalidated');
      }

      // Check if stored refresh token matches
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      if (user.refreshToken !== hashedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check agency access
      const agency = user.agencyId as any;
      if (!agency.canAccess()) {
        throw new UnauthorizedException('Agency access suspended');
      }

      // Generate new tokens (refresh token rotation)
      const tokens = await this.generateTokens(user);

      // Store new hashed refresh token
      await this.storeRefreshToken(user._id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // Increment token version to invalidate all refresh tokens
    await this.userModel.findByIdAndUpdate(userId, {
      $inc: { tokenVersion: 1 },
      $unset: { refreshToken: 1 },
    });
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ success: boolean }> {
    const { token } = verifyEmailDto;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const agency = await this.agencyModel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiresAt: { $gt: new Date() },
    });

    if (!agency) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    agency.isEmailVerified = true;
    agency.emailVerificationToken = undefined;
    agency.emailVerificationExpiresAt = undefined;
    
    await agency.save();

    return { success: true };
  }

  async resendEmailVerification(resendDto: ResendVerificationDto): Promise<{ success: boolean }> {
    const { email } = resendDto;

    const agency = await this.agencyModel.findOne({ email });
    if (!agency) {
      throw new BadRequestException('Agency not found');
    }

    if (agency.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    await this.generateEmailVerificationToken(agency);
    
    // TODO: Send email verification email
    
    return { success: true };
  }

  private async generateTokens(user: UserDocument): Promise<AuthTokens> {
    const jwtPayload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      agencyId: user.agencyId.toString(),
    };

    const refreshPayload: RefreshTokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = this.jwtService.sign(jwtPayload, {
      secret: this.configService.get('jwt.accessSecret'),
      expiresIn: this.configService.get('jwt.accessExpiry'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiry'),
    });

    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedToken });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email }).populate('agencyId');
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    return this.sanitizeUser(user);
  }

  private async generateEmailVerificationToken(agency: AgencyDocument): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutes

    agency.emailVerificationToken = hashedToken;
    agency.emailVerificationExpiresAt = expiresAt;
    
    await agency.save();

    // TODO: Send email with token
    console.log(`Email verification token for ${agency.email}: ${token}`);
  }

  private sanitizeUser(user: any): any {
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    delete userObj.tokenVersion;
    return userObj;
  }
}