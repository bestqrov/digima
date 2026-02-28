import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { JwtPayload } from '../../../shared/interfaces';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../schemas/user.schema").User>;
    findAll(user: JwtPayload, agencyId: string): Promise<import("../schemas/user.schema").User[]>;
    findOne(id: string): Promise<import("../schemas/user.schema").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<import("../schemas/user.schema").User>;
    remove(id: string): Promise<void>;
}
