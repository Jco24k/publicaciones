import { faker } from '@faker-js/faker';
import { CreateEmployeeDto } from 'src/modules/employee/dto/create-employee.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export interface IUserDtoStubParams {
  employeeId: number,
  rolesIds: number[]
}
export const userDtoStub = ({ employeeId, rolesIds }: IUserDtoStubParams): CreateUserDto => {
  return {
    username: faker.string.nanoid(40),
    password: faker.internet.password(),
    email: faker.internet.email(),
    employeeId,
    rolesIds
  };
};