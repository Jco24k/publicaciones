import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportCrypt } from 'src/common/util/passport-crypt';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { employeeDtoStub } from 'src/modules/seed/dto/employee.dto.stub';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import * as permits from '../assets/permits.json';
import { Permit } from 'src/modules/role/entities/permit.entity';
import { ValidPermits } from 'src/common/permit/valid-permit';
import { roleStub } from 'src/modules/seed/dto/role.stub';

@Injectable()
export class DatabaseService implements OnModuleInit {
  logger = new Logger('Nombre del archivo o módulo');

  constructor(
    @InjectRepository(Permit)
    private readonly permitRepository: Repository<Permit>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly connection: DataSource,
  ) { }
  async onModuleInit() {
    await this.createPermits();
    await this.createFirstUserAdmin();
  }
  async createFirstUserAdmin() {
    const permitAdmin = await this.permitRepository.findOne({
      where: { code: ValidPermits.SUPER_ADMIN },
    });

    const adminUser = process.env.USER_ADMIN;
    const adminPass = process.env.PASS_ADMIN;
    const roleAdminName = process.env.ADMIN_ROLE;
    let roleAdmin = await this.roleRepository.findOne({
      where: { name: roleAdminName },
      relations: { permits: true }
    });
    if (!roleAdmin) {
      const dto = roleStub([permitAdmin.id], roleAdminName);
      roleAdmin = await this.roleRepository.save(dto);
    }
    const userFind = await this.userRepository.findOne({
      where: { username: adminUser },
    });
    if (!userFind) {
      const employeeCreate = await this.employeeRepository.save(employeeDtoStub());
      await this.userRepository.save({
        email: adminUser,
        username: adminUser,
        password: PassportCrypt.encrypt(adminPass),
        roles: [roleAdmin],
        employee: employeeCreate
      } as User);
    }
  }

  async getConnection() {
    return this.connection;
  }

  async createPermits() {
    const permissionsCreation: Promise<any>[] = [];
    for (const permit of permits) {
      permissionsCreation.push(this.permitRepository.save(permit as any));
    }
    await Promise.allSettled(permissionsCreation);
  }

}
