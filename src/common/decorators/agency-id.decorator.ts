import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../shared/interfaces';

export const AgencyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    return user?.agencyId;
  },
);