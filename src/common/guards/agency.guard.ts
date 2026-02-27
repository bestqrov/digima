import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtPayload } from '../../shared/interfaces';
import { UserRole } from '../../shared/enums';

@Injectable()
export class AgencyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    
    // Super admin can access all agencies
    if (user?.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Extract agency ID from request params, query, or body
    const agencyId = request.params?.agencyId || 
                     request.query?.agencyId || 
                     request.body?.agencyId;

    // If no agencyId in request, user can only access their own agency data
    if (!agencyId) {
      return true; // Will be filtered by tenant interceptor
    }

    // Check if user is trying to access data from their own agency
    if (agencyId !== user?.agencyId) {
      throw new ForbiddenException('Access denied: Cannot access other agency data');
    }

    return true;
  }
}