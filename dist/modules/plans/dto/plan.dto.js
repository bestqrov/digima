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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlanStatusDto = exports.UpdatePlanDto = exports.CreatePlanDto = exports.PlanLimitsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../shared/enums");
class PlanLimitsDto {
}
exports.PlanLimitsDto = PlanLimitsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum vehicles allowed' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1000),
    __metadata("design:type", Number)
], PlanLimitsDto.prototype, "maxVehicles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum drivers allowed' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5000),
    __metadata("design:type", Number)
], PlanLimitsDto.prototype, "maxDrivers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum trips per month' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], PlanLimitsDto.prototype, "maxTripsPerMonth", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'API rate limit per hour' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], PlanLimitsDto.prototype, "apiRateLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maximum file storage in MB' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(100000),
    __metadata("design:type", Number)
], PlanLimitsDto.prototype, "storageLimit", void 0);
class CreatePlanDto {
}
exports.CreatePlanDto = CreatePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan description' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan price' }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan interval', enum: enums_1.PlanInterval }),
    (0, class_validator_1.IsEnum)(enums_1.PlanInterval),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "interval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan limits', type: PlanLimitsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PlanLimitsDto),
    __metadata("design:type", PlanLimitsDto)
], CreatePlanDto.prototype, "limits", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan features' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePlanDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan status', enum: enums_1.PlanStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.PlanStatus),
    __metadata("design:type", String)
], CreatePlanDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is this a demo plan' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePlanDto.prototype, "isDemo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Demo duration in days' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "demoDurationDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Sort order' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePlanDto.prototype, "sortOrder", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Is plan recommended' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePlanDto.prototype, "isRecommended", void 0);
class UpdatePlanDto extends (0, swagger_1.PartialType)(CreatePlanDto) {
}
exports.UpdatePlanDto = UpdatePlanDto;
class UpdatePlanStatusDto {
}
exports.UpdatePlanStatusDto = UpdatePlanStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New plan status', enum: enums_1.PlanStatus }),
    (0, class_validator_1.IsEnum)(enums_1.PlanStatus),
    __metadata("design:type", String)
], UpdatePlanStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for status change' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdatePlanStatusDto.prototype, "reason", void 0);
//# sourceMappingURL=plan.dto.js.map