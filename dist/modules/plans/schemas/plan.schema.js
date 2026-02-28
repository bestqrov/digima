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
exports.PlanSchema = exports.Plan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const enums_1 = require("../../../shared/enums");
let Plan = class Plan {
};
exports.Plan = Plan;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true }),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Plan.prototype, "displayName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: enums_1.PlanInterval,
        default: enums_1.PlanInterval.MONTHLY
    }),
    __metadata("design:type", String)
], Plan.prototype, "interval", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Plan.prototype, "maxVehicles", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Plan.prototype, "maxDrivers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Plan.prototype, "maxTripsPerMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Plan.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: enums_1.PlanStatus,
        default: enums_1.PlanStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Plan.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Plan.prototype, "sortOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Plan.prototype, "isPopular", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Plan.prototype, "isVisible", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Plan.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Plan.prototype, "updatedAt", void 0);
exports.Plan = Plan = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false,
    })
], Plan);
exports.PlanSchema = mongoose_1.SchemaFactory.createForClass(Plan);
exports.PlanSchema.index({ status: 1, isVisible: 1 });
exports.PlanSchema.index({ sortOrder: 1 });
exports.PlanSchema.index({ name: 1 }, { unique: true });
//# sourceMappingURL=plan.schema.js.map