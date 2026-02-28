import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UsersService } from '../../users/services/users.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { JwtPayload } from '../../../shared/interfaces';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    private userModel;
    constructor(configService: ConfigService, usersService: UsersService, userModel: Model<UserDocument>);
    validate(payload: JwtPayload): Promise<any>;
}
export {};
