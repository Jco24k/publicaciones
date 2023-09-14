import { ValidPermits } from 'src/common/permit/valid-permit';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';

export interface AuthParameterDto {
  roles: ValidPermits[];
  sameUser?: boolean;
}
