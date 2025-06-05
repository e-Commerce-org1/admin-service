
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AdminDocument } from '../schemas/admin.schema';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;
    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
    } else {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    }

    if (!request.user) {
      throw new UnauthorizedException('You must be logged in to perform this action');
    }

    return true;
  }
}