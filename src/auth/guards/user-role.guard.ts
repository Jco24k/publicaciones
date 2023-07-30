import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/entities/User.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { META_USER } from '../decorators/user-protected.decorator';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: RolesValid[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    const sameUser: boolean = this.reflector.get(
      META_USER,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    if (!validRoles || validRoles.length == 0) return true;
    for (const role of user.roles)
      if (validRoles.includes(role.name)) return true;

    if (sameUser) {
      const idParam: number = req.params.id;
      if (idParam !== user.id) {
        throw new ForbiddenException(
          'You are not allowed to perform this action on another user',
        );
      }
      return true;
    }

    throw new ForbiddenException(`User with ${user.id} need a valid role`);
  }
}
