import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorators';
import { permissions} from '../enums/permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<permissions[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions || requiredPermissions.length === 0) return true; // no permissions required

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.permissions || !Array.isArray(user.permissions)) {
      throw new ForbiddenException('User permissions not found or invalid');
    }

    const hasAllPermissions = requiredPermissions.every((perm) => user.permissions.includes(perm));
    if (hasAllPermissions) return true;

    throw new ForbiddenException(
      `User lacks required permissions: ${requiredPermissions.join(', ')}`,
    );
  }
}
