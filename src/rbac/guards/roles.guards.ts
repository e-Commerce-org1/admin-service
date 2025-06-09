import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { AdminRoles } from '../enums/admin-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRoles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true; // no roles required

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role) throw new ForbiddenException('User role not found');

    if (requiredRoles.includes(user.role)) return true;

    throw new ForbiddenException(`User role '${user.role}' is not authorized`);
  }
}
