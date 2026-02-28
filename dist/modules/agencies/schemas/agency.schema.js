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
exports.AgencySchema = exports.Agency = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const enums_1 = require("../../../shared/enums");
let Agency = class Agency {
};
exports.Agency = Agency;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Agency.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, lowercase: true }),
    __metadata("design:type", String)
], Agency.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Agency.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "whatsappNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Agency.prototype, "countryCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Plan', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Agency.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: enums_1.AgencyStatus,
        default: enums_1.AgencyStatus.DEMO
    }),
    __metadata("design:type", String)
], Agency.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "demoExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Agency.prototype, "isEmailVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Agency.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Agency.prototype, "isWhatsappVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "emailVerificationExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "phoneVerificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "phoneVerificationExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "whatsappVerificationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "whatsappVerificationExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Agency.prototype, "marketingConsent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Agency.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Agency.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "subscriptionStartedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "subscriptionEndsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "lastPaymentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Agency.prototype, "nextBillingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Agency.prototype, "currentVehicles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Agency.prototype, "currentDrivers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Agency.prototype, "currentMonthTrips", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Agency.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Agency.prototype, "updatedAt", void 0);
exports.Agency = Agency = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
    })
], Agency);
exports.AgencySchema = mongoose_1.SchemaFactory.createForClass(Agency);
exports.AgencySchema.index({ email: 1 }, { unique: true });
exports.AgencySchema.index({ status: 1 });
exports.AgencySchema.index({ planId: 1 });
exports.AgencySchema.index({ demoExpiresAt: 1 });
exports.AgencySchema.index({ emailVerificationExpiresAt: 1 });
exports.AgencySchema.index({ phoneVerificationExpiresAt: 1 });
exports.AgencySchema.index({ whatsappVerificationExpiresAt: 1 });
exports.AgencySchema.methods.isDemoExpired = function () {
    return this.status === enums_1.AgencyStatus.DEMO &&
        this.demoExpiresAt &&
        new Date() > this.demoExpiresAt;
};
exports.AgencySchema.methods.canAccess = function () {
    if (this.status === enums_1.AgencyStatus.SUSPENDED) {
        return false;
    }
    if (this.isDemoExpired() && this.status !== enums_1.AgencyStatus.ACTIVE) {
        return false;
    }
    return true;
};
//# sourceMappingURL=agency.schema.js.map