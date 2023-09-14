import { faker } from '@faker-js/faker';
import { CreateRoleDto } from 'src/modules/role/dto/create-role.dto';

export const roleDtoStub = (permitIds?: number[], nameRole?: string): CreateRoleDto => {
  return {
    name: nameRole || faker.string.nanoid(40),
    permitIds
  };
};
