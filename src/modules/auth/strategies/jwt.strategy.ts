import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/services/users.service';
import { JwtPayload } from '../../../shared/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
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
      const agency = await user.populate('agencyId');
      if (!agency.agencyId.canAccess()) {
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