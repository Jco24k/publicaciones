import { faker } from '@faker-js/faker';
import { CreateEmployeeDto } from 'src/modules/employee/dto/create-employee.dto';
import { CreateRoleDto } from 'src/modules/role/dto/create-role.dto';
import { UpdatePermitDto } from 'src/modules/role/dto/update-permit.dto';

export const permitDtoStub = (): UpdatePermitDto => {
  return {
    description: faker.string.nanoid(40),
  };
};