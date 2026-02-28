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
exports.SubscriptionGuard = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agency_schema_1 = require("../../modules/agencies/schemas/agency.schema");
const plan_schema_1 = require("../../modules/plans/schemas/plan.schema");
const enums_1 = require("../../shared/enums");
let SubscriptionGuard = class SubscriptionGuard {
    constructor(agencyModel, planModel) {
        this.agencyModel = agencyModel;
        this.planModel = planModel;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.agencyId) {
            throw new common_1.ForbiddenException('User not associated with any agency');
        }
        const agency = await this.agencyModel
            .findById(user.agencyId)
            .populate('planId')
            .exec();
        if (!agency) {
            throw new common_1.ForbiddenException('Agency not found');
        }
        const currentStatus = agency.status;
        if (currentStatus !== enums_1.AgencyStatus.ACTIVE && currentStatus !== enums_1.AgencyStatus.DEMO) {
            throw new common_1.ForbiddenException('Agency account suspended');
        }
        if (currentStatus === enums_1.AgencyStatus.DEMO && agency.demoExpiresAt && new Date() > agency.demoExpiresAt) {
            throw new common_1.ForbiddenException('Demo period expired. Please upgrade your subscription.');
        }
        const path = request.route?.path || '';
        const isActivationEndpoint = path.includes('subscription') && path.includes('activate');
        if (isActivationEndpoint && !agency.isEmailVerified) {
            throw new common_1.ForbiddenException('Email verification required before subscription activation');
        }
        request.agency = agency;
        request.plan = agency.planId;
        return true;
    }
};
exports.SubscriptionGuard = SubscriptionGuard;
exports.SubscriptionGuard = SubscriptionGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agency_schema_1.Agency.name)),
    __param(1, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SubscriptionGuard);
//# sourceMappingURL=subscription.guard.js.map