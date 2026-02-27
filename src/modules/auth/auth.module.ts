import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy, JwtStrategy } from './strategies';
import { UsersModule } from '../users/users.module';
import { PlansModule } from '../plans/plans.module';

import { User, UserSchema } from '../users/schemas/user.schema';
import { Agency, AgencySchema } from '../agencies/schemas/agency.schema';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({}), // Configuration will be dynamic
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Agency.name, schema: AgencySchema },
    ]),
    UsersModule,
    PlansModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}