import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportCrypt } from 'src/common/util/passport-crypt';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/User.entity';
import { DataSource, In, Repository } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  logger = new Logger('Nombre del archivo o módulo');

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly connection: DataSource,
  ) {}
  async onModuleInit() {
    await this.createFirstUserAdmin();
  }
  async createFirstUserAdmin() {
    const adminUser = process.env.USER_ADMIN;
    const adminPass = process.env.PASS_ADMIN;
    const rolesValid: RolesValid[] = Object.values(RolesValid);
    const passFind = (
      await this.roleRepository.find({
        where: {
          name: In(rolesValid),
        },
      })
    ).map((x) => x.name);
    if (passFind.length !== rolesValid.length) {
      const rolesRegister = rolesValid.filter((x) => !passFind.includes(x));
      const rolesCreate: Promise<Role>[] = rolesRegister.map((x) => {
        return this.roleRepository.save({
          name: x,
        } as Role);
      });
      await Promise.all(rolesCreate);
    }
    const roles = await this.roleRepository.find();
    const userFind = await this.userRepository.findOne({
      where: { username: adminUser },
    });
    if (!userFind)
      await this.userRepository.save({
        email: adminUser,
        username: adminUser,
        password: PassportCrypt.encrypt(adminPass),
        roles,
      } as User);
  }

  async getConnection() {
    return this.connection;
  }
}
