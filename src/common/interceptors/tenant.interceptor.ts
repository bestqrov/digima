import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../shared/interfaces';
import { UserRole } from '../../shared/enums';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    // Add tenant context to request for services to use
    if (user && user.role !== UserRole.SUPER_ADMIN) {
      request.tenantId = user.agencyId;
    }

    return next.handle();
  }
}