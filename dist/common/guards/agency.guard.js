"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyGuard = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../shared/enums");
let AgencyGuard = class AgencyGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user?.role === enums_1.UserRole.SUPER_ADMIN) {
            return true;
        }
        const agencyId = request.params?.agencyId ||
            request.query?.agencyId ||
            request.body?.agencyId;
        if (!agencyId) {
            return true;
        }
        if (agencyId !== user?.agencyId) {
            throw new common_1.ForbiddenException('Access denied: Cannot access other agency data');
        }
        return true;
    }
};
exports.AgencyGuard = AgencyGuard;
exports.AgencyGuard = AgencyGuard = __decorate([
    (0, common_1.Injectable)()
], AgencyGuard);
//# sourceMappingURL=agency.guard.js.map