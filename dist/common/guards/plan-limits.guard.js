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
exports.PlanLimitsGuard = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agency_schema_1 = require("../../modules/agencies/schemas/agency.schema");
const plan_schema_1 = require("../../modules/plans/schemas/plan.schema");
let PlanLimitsGuard = class PlanLimitsGuard {
    constructor(agencyModel, planModel) {
        this.agencyModel = agencyModel;
        this.planModel = planModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const body = request.body;
        if (!user?.agencyId) {
            return false;
        }
        const agency = await this.agencyModel
            .findById(user.agencyId)
            .populate('planId')
            .exec();
        if (!agency) {
            return false;
        }
        const plan = agency.planId;
        const path = request.route?.path || '';
        const method = request.method;
        if (method !== 'POST') {
            return true;
        }
        let exceedsLimit = false;
        let limitType = '';
        if (path.includes('vehicles')) {
            exceedsLimit = agency.currentVehicles >= plan.maxVehicles;
            limitType = 'vehicles';
        }
        else if (path.includes('users') && body?.checkType !== 'trip') {
            exceedsLimit = agency.currentDrivers >= plan.maxDrivers;
            limitType = 'drivers';
        }
        else if (path.includes('trips')) {
            exceedsLimit = agency.currentMonthTrips >= plan.maxTripsPerMonth;
            limitType = 'trips this month';
        }
        if (exceedsLimit) {
            throw new common_1.ForbiddenException(`Plan limit exceeded. Maximum ${limitType} allowed: ${this.getLimit(plan, limitType)}`);
        }
        return true;
    }
    getLimit(plan, limitType) {
        switch (limitType) {
            case 'vehicles':
                return plan.maxVehicles;
            case 'drivers':
                return plan.maxDrivers;
            case 'trips this month':
                return plan.maxTripsPerMonth;
            default:
                return 0;
        }
    }
};
exports.PlanLimitsGuard = PlanLimitsGuard;
exports.PlanLimitsGuard = PlanLimitsGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agency_schema_1.Agency.name)),
    __param(1, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PlanLimitsGuard);
//# sourceMappingURL=plan-limits.guard.js.map