import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requiredRoles = this.getRoles(context);

    if (!requiredRoles) return true;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }

  private getRoles(context: ExecutionContext): string[] | undefined {
    return Reflect.getMetadata('roles', context.getHandler());
  }
}
