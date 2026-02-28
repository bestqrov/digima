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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const user_schema_1 = require("../schemas/user.schema");
const constants_1 = require("../../../shared/constants");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, constants_1.BCRYPT_CONSTANTS.SALT_ROUNDS);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        return createdUser.save();
    }
    async findAll(agencyId) {
        const filter = agencyId ? { agencyId } : {};
        return this.userModel.find(filter).populate('agencyId', 'name email').exec();
    }
    async findById(id) {
        const user = await this.userModel.findById(id).populate('agencyId', 'name email').exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).populate('agencyId', 'name email').exec();
    }
    async update(id, updateUserDto) {
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, constants_1.BCRYPT_CONSTANTS.SALT_ROUNDS);
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).populate('agencyId', 'name email').exec();
        if (!updatedUser) {
            throw new common_1.NotFoundException('User not found');
        }
        return updatedUser;
    }
    async remove(id) {
        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async incrementTokenVersion(id) {
        await this.userModel.findByIdAndUpdate(id, { $inc: { tokenVersion: 1 } }).exec();
    }
    async updateLastLogin(id) {
        await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() }).exec();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map