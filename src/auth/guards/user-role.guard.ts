import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { META_USER } from '../decorators/user-protected.decorator';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { ValidPermits } from 'src/common/permit/valid-permit';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validPermits: ValidPermits[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    validPermits.push(ValidPermits.SUPER_ADMIN)

    const sameUser: boolean = this.reflector.get(
      META_USER,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    if (!validPermits || validPermits.length == 0) return true;
    const user_permits: ValidPermits[] =
      user.roles?.flatMap(
        (role) => role.permits?.map((permit) => permit.code) ?? [],
      ) ?? [];

    const hasAccess = validPermits.some((elemento) =>
      user_permits.includes(elemento),
    );
    if (hasAccess) return true;

    if (sameUser) {
      const idParam: number = req.params.id;
      if (+idParam !== user.id) {
        throw new ForbiddenException(
          'You are not allowed to perform this action on another user',
        );
      }
      return true;
    }
    console.log(user)
    throw new ForbiddenException(`User with id ${user.id} need a valid role`);
  }
}
