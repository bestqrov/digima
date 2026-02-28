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
exports.AgenciesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agency_schema_1 = require("../schemas/agency.schema");
let AgenciesService = class AgenciesService {
    constructor(agencyModel) {
        this.agencyModel = agencyModel;
    }
    async create(createAgencyDto) {
        const existingAgency = await this.agencyModel.findOne({ email: createAgencyDto.email });
        if (existingAgency) {
            throw new common_1.ConflictException('Agency with this email already exists');
        }
        const createdAgency = new this.agencyModel(createAgencyDto);
        return createdAgency.save();
    }
    async findAll() {
        return this.agencyModel.find().exec();
    }
    async findById(id) {
        const agency = await this.agencyModel.findById(id).exec();
        if (!agency) {
            throw new common_1.NotFoundException('Agency not found');
        }
        return agency;
    }
    async findByEmail(email) {
        return this.agencyModel.findOne({ email }).exec();
    }
    async update(id, updateAgencyDto) {
        const updatedAgency = await this.agencyModel.findByIdAndUpdate(id, updateAgencyDto, { new: true }).exec();
        if (!updatedAgency) {
            throw new common_1.NotFoundException('Agency not found');
        }
        return updatedAgency;
    }
    async remove(id) {
        const result = await this.agencyModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Agency not found');
        }
    }
    async deactivate(id) {
        return this.update(id, { isActive: false });
    }
    async activate(id) {
        return this.update(id, { isActive: true });
    }
};
exports.AgenciesService = AgenciesService;
exports.AgenciesService = AgenciesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agency_schema_1.Agency.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AgenciesService);
//# sourceMappingURL=agencies.service.js.map