"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgencyId = void 0;
const common_1 = require("@nestjs/common");
exports.AgencyId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.agencyId;
});
//# sourceMappingURL=agency-id.decorator.js.map