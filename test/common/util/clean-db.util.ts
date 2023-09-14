import { ValidPermits } from 'src/common/permit/valid-permit';
import { Permit } from 'src/modules/role/entities/permit.entity';
import { roleDtoStub } from 'src/modules/seed/dto/role.dto.stub';
import { PassportCrypt } from 'src/common/util/passport-crypt';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { Role } from 'src/modules/role/entities/role.entity';
import { employeeDtoStub } from 'src/modules/seed/dto/employee.dto.stub';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, In } from 'typeorm';

export const CleanDB = async (dbConnection: DataSource) => {
  await dbConnection.createQueryBuilder().delete().from(Post).execute();
  await dbConnection.createQueryBuilder().delete().from(User).execute();
  await dbConnection.createQueryBuilder().delete().from(Employee).execute();
  await createFirstUserAdmin(dbConnection);
};

const createFirstUserAdmin = async (dataSource: DataSource) => {
  try {
    const permitRepository = dataSource.getRepository(Permit);
    const roleRepository = dataSource.getRepository(Role);
    const employeeRepository = dataSource.getRepository(Employee);
    const userRepository = dataSource.getRepository(User);

    const permitAdmin = await permitRepository.findOne({
      where: { code: ValidPermits.SUPER_ADMIN },
    });
    const adminUser = process.env.USER_ADMIN;
    const adminPass = process.env.PASS_ADMIN;
    const roleAdminName = process.env.ADMIN_ROLE;
    let roleAdmin = await roleRepository.findOne({
      where: { name: roleAdminName },
    });
    if (!roleAdmin)
      roleAdmin = await roleRepository.save(
        roleDtoStub([permitAdmin.id], roleAdminName),
      );
    let userFind = await userRepository.findOne({
      where: { username: adminUser },
    });
    if (!userFind) {
      const employeeCreate = await employeeRepository.save(employeeDtoStub());
      userFind = await userRepository.save({
        email: adminUser,
        username: adminUser,
        password: PassportCrypt.encrypt(adminPass),
        roles: [roleAdmin],
        employee: employeeCreate
      } as User);
    }
  } catch (error) {
    console.error('Error creating the first admin user:', error);
  }
};
