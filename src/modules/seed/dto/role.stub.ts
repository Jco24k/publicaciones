import { Permit } from 'src/modules/role/entities/permit.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { faker } from '@faker-js/faker';

export const roleStub = (permits?: number[], nameRole?: string): Partial<Role> => {
    return {
      name: nameRole || faker.string.nanoid(40),
      permits: permits?.map((permit) => ({ id: permit } as Permit)),
    };
  };