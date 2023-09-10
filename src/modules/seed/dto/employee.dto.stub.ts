import { faker } from '@faker-js/faker';
import { CreateEmployeeDto } from 'src/modules/employee/dto/create-employee.dto';

export const employeeDtoStub = (): CreateEmployeeDto => {
  return {
    name: faker.company.name(),
    last_name: faker.company.name(),
    dni: faker.string.numeric({
        allowLeadingZeros: true,
        length: { min: 8, max: 8 },
      })
  };
};