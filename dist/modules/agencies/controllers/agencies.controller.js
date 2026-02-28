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
exports.AgenciesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agencies_service_1 = require("../services/agencies.service");
const dto_1 = require("../dto");
const guards_1 = require("../../../common/guards");
const decorators_1 = require("../../../common/decorators");
const enums_1 = require("../../../shared/enums");
let AgenciesController = class AgenciesController {
    constructor(agenciesService) {
        this.agenciesService = agenciesService;
    }
    create(createAgencyDto) {
        return this.agenciesService.create(createAgencyDto);
    }
    findAll() {
        return this.agenciesService.findAll();
    }
    findOne(id) {
        return this.agenciesService.findById(id);
    }
    update(id, updateAgencyDto) {
        return this.agenciesService.update(id, updateAgencyDto);
    }
    remove(id) {
        return this.agenciesService.remove(id);
    }
    deactivate(id) {
        return this.agenciesService.deactivate(id);
    }
    activate(id) {
        return this.agenciesService.activate(id);
    }
};
exports.AgenciesController = AgenciesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new agency' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Agency created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Agency with this email already exists' }),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateAgencyDto]),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all agencies' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agencies retrieved successfully' }),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get agency by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agency retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agency not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update agency' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agency updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agency not found' }),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.AGENCY_ADMIN),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateAgencyDto]),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete agency' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agency deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Agency not found' }),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate agency' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agency deactivated successfully' }),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "deactivate", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Activate agency' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agency activated successfully' }),
    (0, decorators_1.Roles)(enums_1.UserRole.SUPER_ADMIN),
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgenciesController.prototype, "activate", null);
exports.AgenciesController = AgenciesController = __decorate([
    (0, swagger_1.ApiTags)('Agencies'),
    (0, common_1.Controller)('agencies'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    __metadata("design:paramtypes", [agencies_service_1.AgenciesService])
], AgenciesController);
//# sourceMappingURL=agencies.controller.js.map