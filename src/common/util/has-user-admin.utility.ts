import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { User } from 'src/modules/user/entities/user.entity';

export const hasUserAdmin = (
  user: Partial<User>,
  adminpermits: RolesValid[] = [RolesValid.ADMINISTRADOR],
) => {
  const roles = user.roles.map((x) => x.name);
  return adminpermits.some((rol) => roles.includes(rol)) ? undefined : user;
};
