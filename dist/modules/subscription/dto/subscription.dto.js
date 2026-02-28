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
exports.CancelSubscriptionDto = exports.RenewSubscriptionDto = exports.UpdateSubscriptionStatusDto = exports.UpdateSubscriptionDto = exports.CreateSubscriptionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../shared/enums");
class CreateSubscriptionDto {
}
exports.CreateSubscriptionDto = CreateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agency ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "agencyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subscription status', enum: enums_1.SubscriptionStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.SubscriptionStatus),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subscription start date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Subscription end date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next billing date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "nextBillingDate", void 0);
class UpdateSubscriptionDto extends (0, swagger_1.PartialType)(CreateSubscriptionDto) {
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
class UpdateSubscriptionStatusDto {
}
exports.UpdateSubscriptionStatusDto = UpdateSubscriptionStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New subscription status', enum: enums_1.SubscriptionStatus }),
    (0, class_validator_1.IsEnum)(enums_1.SubscriptionStatus),
    __metadata("design:type", String)
], UpdateSubscriptionStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for status change' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateSubscriptionStatusDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next billing date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateSubscriptionStatusDto.prototype, "nextBillingDate", void 0);
class RenewSubscriptionDto {
}
exports.RenewSubscriptionDto = RenewSubscriptionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New plan ID (optional for plan change)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], RenewSubscriptionDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Next billing date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RenewSubscriptionDto.prototype, "nextBillingDate", void 0);
class CancelSubscriptionDto {
}
exports.CancelSubscriptionDto = CancelSubscriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cancellation reason' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CancelSubscriptionDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'End subscription immediately' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], CancelSubscriptionDto.prototype, "immediate", void 0);
//# sourceMappingURL=subscription.dto.js.map