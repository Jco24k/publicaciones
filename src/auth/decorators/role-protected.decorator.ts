import { ValidPermits } from 'src/common/permit/valid-permit';
import { SetMetadata } from '@nestjs/common';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
export const META_ROLES = 'roles';
export const RoleProtected = (...args: ValidPermits[]) => {
  return SetMetadata(META_ROLES, args);
};
