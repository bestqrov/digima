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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_schema_1 = require("../schemas/plan.schema");
const enums_1 = require("../../../shared/enums");
let PlansService = class PlansService {
    constructor(planModel) {
        this.planModel = planModel;
    }
    async create(createPlanDto) {
        const plan = new this.planModel(createPlanDto);
        return plan.save();
    }
    async findAll() {
        return this.planModel
            .find({ status: enums_1.PlanStatus.ACTIVE, isVisible: true })
            .sort({ sortOrder: 1, createdAt: 1 })
            .exec();
    }
    async findById(id) {
        const plan = await this.planModel.findById(id).exec();
        if (!plan) {
            throw new common_1.NotFoundException(`Plan with ID ${id} not found`);
        }
        return plan;
    }
    async update(id, updatePlanDto) {
        const plan = await this.planModel
            .findByIdAndUpdate(id, updatePlanDto, { new: true })
            .exec();
        if (!plan) {
            throw new common_1.NotFoundException(`Plan with ID ${id} not found`);
        }
        return plan;
    }
    async remove(id) {
        const result = await this.planModel.findByIdAndUpdate(id, { status: enums_1.PlanStatus.INACTIVE }, { new: true }).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Plan with ID ${id} not found`);
        }
    }
    async checkLimits(planId, currentUsage) {
        const plan = await this.findById(planId);
        return {
            canAddVehicle: currentUsage.vehicles < plan.maxVehicles,
            canAddDriver: currentUsage.drivers < plan.maxDrivers,
            canAddTrip: currentUsage.trips < plan.maxTripsPerMonth,
            limits: {
                maxVehicles: plan.maxVehicles,
                maxDrivers: plan.maxDrivers,
                maxTripsPerMonth: plan.maxTripsPerMonth,
            },
        };
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PlansService);
//# sourceMappingURL=plans.service.js.map