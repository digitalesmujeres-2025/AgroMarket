import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const payload = request.user;

    if (!payload || !payload.role) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este contenido',
      );
    }

    const hasRole = requiredRoles.some((role) => payload.role.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este contenido',
      );
    }

    return true;
  }
}
