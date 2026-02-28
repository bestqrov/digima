import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../../users/services/users.service';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { JwtPayload } from '../../../shared/interfaces';
import { AgencyStatus } from '../../../shared/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // Validate that the user still exists and is active
    try {
      const user = await this.usersService.findById(payload.sub);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Check if agency can still access the system
      const userWithAgency = await this.userModel.findById(payload.sub).populate('agencyId').exec();
      if (!userWithAgency?.agencyId || (userWithAgency.agencyId as any).status !== AgencyStatus.ACTIVE) {
        throw new UnauthorizedException('Agency access suspended or demo expired');
      }

      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        agencyId: payload.agencyId,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}