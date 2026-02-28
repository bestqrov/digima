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
exports.AgencyUsageDto = exports.UpdateAgencyStatusDto = exports.UpdateAgencyDto = exports.CreateAgencyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../shared/enums");
class CreateAgencyDto {
}
exports.CreateAgencyDto = CreateAgencyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agency name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Agency email' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase()),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number' }),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'WhatsApp number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Country code (ISO 3166-1 alpha-2)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Plan ID' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agency status', enum: enums_1.AgencyStatus }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.AgencyStatus),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Marketing consent' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAgencyDto.prototype, "marketingConsent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Traffic source' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agency address' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agency website' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Logo URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "logo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timezone' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code (ISO 4217)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Language code (ISO 639-1)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(5),
    __metadata("design:type", String)
], CreateAgencyDto.prototype, "language", void 0);
class UpdateAgencyDto extends (0, swagger_1.PartialType)(CreateAgencyDto) {
}
exports.UpdateAgencyDto = UpdateAgencyDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Agency active status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAgencyDto.prototype, "isActive", void 0);
class UpdateAgencyStatusDto {
}
exports.UpdateAgencyStatusDto = UpdateAgencyStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New agency status', enum: enums_1.AgencyStatus }),
    (0, class_validator_1.IsEnum)(enums_1.AgencyStatus),
    __metadata("design:type", String)
], UpdateAgencyStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reason for status change' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateAgencyStatusDto.prototype, "reason", void 0);
class AgencyUsageDto {
}
exports.AgencyUsageDto = AgencyUsageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current vehicles count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AgencyUsageDto.prototype, "currentVehicles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current drivers count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AgencyUsageDto.prototype, "currentDrivers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current month trips count' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AgencyUsageDto.prototype, "currentMonthTrips", void 0);
//# sourceMappingURL=agency.dto.js.map