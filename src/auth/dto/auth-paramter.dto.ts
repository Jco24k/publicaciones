import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';

export interface AuthParameterDto {
  roles: RolesValid[];
  sameUser?: boolean;
}
