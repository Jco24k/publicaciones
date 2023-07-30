import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { AuthParameterDto } from '../dto/auth-paramter.dto';
import { RoleProtected } from './role-protected.decorator';
import { UserProtected } from './user-protected.decorator';

export function Auth({ roles = [], sameUser = false }: AuthParameterDto) {
  return applyDecorators(
    RoleProtected(...roles),
    UserProtected(sameUser),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
