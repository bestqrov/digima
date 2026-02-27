import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../shared/enums';
import { JwtPayload } from '../../shared/interfaces';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: JwtPayload } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false;
    }

    // Super admin can access everything
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    return requiredRoles.some((role) => user?.role === role);
  }
}