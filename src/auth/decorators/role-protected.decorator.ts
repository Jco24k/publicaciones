import { SetMetadata } from '@nestjs/common';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
export const META_ROLES = 'roles';
export const RoleProtected = (...args: RolesValid[]) => {
  return SetMetadata(META_ROLES, args);
};
