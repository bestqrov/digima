"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user_schema_1 = require("../../users/schemas/user.schema");
const agency_schema_1 = require("../../agencies/schemas/agency.schema");
const users_service_1 = require("../../users/services/users.service");
const plans_service_1 = require("../../plans/services/plans.service");
const enums_1 = require("../../../shared/enums");
let AuthService = class AuthService {
    constructor(usersService, plansService, jwtService, configService, userModel, agencyModel) {
        this.usersService = usersService;
        this.plansService = plansService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.userModel = userModel;
        this.agencyModel = agencyModel;
    }
    async register(registerDto) {
        const { agencyName, email, password, adminName, phoneNumber, whatsappNumber, countryCode, planId, marketingConsent = false, source } = registerDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const plan = await this.plansService.findById(planId);
        if (!plan) {
            throw new common_1.BadRequestException('Invalid plan selected');
        }
        const demoExpiresAt = new Date();
        demoExpiresAt.setDate(demoExpiresAt.getDate() + 7);
        const agency = new this.agencyModel({
            name: agencyName,
            email,
            phoneNumber,
            whatsappNumber,
            countryCode,
            planId,
            status: enums_1.AgencyStatus.DEMO,
            demoExpiresAt,
            marketingConsent,
            source,
            isEmailVerified: false,
            isPhoneVerified: false,
            isWhatsappVerified: false,
        });
        await agency.save();
        const saltRounds = this.configService.get('app.bcryptRounds');
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new this.userModel({
            agencyId: agency._id,
            name: adminName,
            email,
            password: hashedPassword,
            role: enums_1.UserRole.AGENCY_ADMIN,
            isActive: true,
            tokenVersion: 0,
        });
        await user.save();
        await this.generateEmailVerificationToken(agency);
        const tokens = await this.generateTokens(user);
        await this.storeRefreshToken(user._id, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel
            .findOne({ email })
            .populate('agencyId')
            .exec();
        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const agency = user.agencyId;
        if (!agency.canAccess()) {
            if (agency.isDemoExpired()) {
                throw new common_1.UnauthorizedException('Demo period expired. Please upgrade your subscription.');
            }
            throw new common_1.UnauthorizedException('Agency account suspended');
        }
        user.lastLogin = new Date();
        await user.save();
        const tokens = await this.generateTokens(user);
        await this.storeRefreshToken(user._id, tokens.refreshToken);
        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }
    async refreshToken(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const user = await this.userModel
                .findById(payload.sub)
                .populate('agencyId')
                .exec();
            if (!user || !user.isActive) {
                throw new common_1.UnauthorizedException('User not found or inactive');
            }
            if (payload.tokenVersion !== user.tokenVersion) {
                throw new common_1.UnauthorizedException('Token has been invalidated');
            }
            const hashedToken = await bcrypt.hash(refreshToken, 10);
            if (user.refreshToken !== hashedToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const agency = user.agencyId;
            if (!agency.canAccess()) {
                throw new common_1.UnauthorizedException('Agency access suspended');
            }
            const tokens = await this.generateTokens(user);
            await this.storeRefreshToken(user._id, tokens.refreshToken);
            return tokens;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.userModel.findByIdAndUpdate(userId, {
            $inc: { tokenVersion: 1 },
            $unset: { refreshToken: 1 },
        });
    }
    async verifyEmail(verifyEmailDto) {
        const { token } = verifyEmailDto;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const agency = await this.agencyModel.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpiresAt: { $gt: new Date() },
        });
        if (!agency) {
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        agency.isEmailVerified = true;
        agency.emailVerificationToken = undefined;
        agency.emailVerificationExpiresAt = undefined;
        await agency.save();
        return { success: true };
    }
    async resendEmailVerification(resendDto) {
        const { email } = resendDto;
        const agency = await this.agencyModel.findOne({ email });
        if (!agency) {
            throw new common_1.BadRequestException('Agency not found');
        }
        if (agency.isEmailVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        await this.generateEmailVerificationToken(agency);
        return { success: true };
    }
    async generateTokens(user) {
        const jwtPayload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            agencyId: user.agencyId.toString(),
        };
        const refreshPayload = {
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
    async storeRefreshToken(userId, refreshToken) {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashedToken });
    }
    async validateUser(email, password) {
        const user = await this.userModel.findOne({ email }).populate('agencyId');
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        if (!user.emailVerified) {
            throw new common_1.UnauthorizedException('Please verify your email before logging in');
        }
        return this.sanitizeUser(user);
    }
    async generateEmailVerificationToken(agency) {
        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        agency.emailVerificationToken = hashedToken;
        agency.emailVerificationExpiresAt = expiresAt;
        await agency.save();
        console.log(`Email verification token for ${agency.email}: ${token}`);
    }
    sanitizeUser(user) {
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;
        delete userObj.tokenVersion;
        return userObj;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(5, (0, mongoose_1.InjectModel)(agency_schema_1.Agency.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        plans_service_1.PlansService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map