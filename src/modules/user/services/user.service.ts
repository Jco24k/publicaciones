import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RoleService } from '../../role/services/role.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { PassportCrypt } from 'src/common/util/passport-crypt';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { QueryParamsConvert } from 'src/common/dto/convert-query-params.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { EmployeeService } from 'src/modules/employee/services/employee.service';

@Injectable()
export class UserService {
  private readonly entityName = User.name;
  private readonly relationsEntity: FindOptionsRelations<User> = {
    roles: {
      permits: true
    },
  };
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly employeeService: EmployeeService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) { }

  async findAll(queryParams: PaginationQueryParams) {
    const { query } = this.configService;
    const { page = query.page_number, page_size = query.page_size } =
      queryParams;
    const { all, isActive, relations } = queryParams as QueryParamsConvert;
    const optionsToFindAll: FindManyOptions<User> = {
      where: {
        isActive,
      },
    };
    if (!all) {
      optionsToFindAll.take = page_size;
      optionsToFindAll.skip = page_size * (page - query.min_page);
    }
    if (relations) optionsToFindAll.relations = this.relationsEntity;
    return await this.userRepository.find(optionsToFindAll);
  }

  async create(createUserDto: CreateUserDto) {
    const { roles, restOfDto } = await this.getAndVerifyDto(createUserDto);
    try {
      const user = await this.userRepository.save({
        ...restOfDto,
        roles,
      });
      delete user.password;
      return user;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async getOneById(id: number, relations = true) {
    const user = await this.userRepository.findOne({
      where: { id },
      ...(relations && { relations: this.relationsEntity }),
    });
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    return user;
  }

  async update(id: number, createUserDto: UpdateUserDto) {
    const user = await this.getOneById(id, false);
    const { roles, restOfDto } = await this.getAndVerifyDto(createUserDto);
    try {
      const userUpdate = await this.userRepository.save({
        ...user,
        ...restOfDto,
        roles,
      });
      delete userUpdate.password;
      return userUpdate;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }

  async updateRole(id: number, createUserDto: UpdateUserRoleDto) {
    const user = await this.getOneById(id);
    const { roles, restOfDto } = await this.getAndVerifyDto(createUserDto);
    try {
      const userUpdate = await this.userRepository.save({
        ...user,
        ...restOfDto,
        roles,
      });
      return userUpdate;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async remove(id: number) {
    const user = await this.getOneById(id, false);
    await this.userRepository.save({ id: user.id, isActive: false });
  }

  async getAndVerifyDto(
    dto: Partial<CreateUserDto & UpdateUserDto & UpdateUserRoleDto> = {},
  ) {
    const { rolesIds = [], employeeId, ...restOfDto } = dto;
    const [roles, employee] = await Promise.all([
      rolesIds?.length ? this.roleService.getRoles(rolesIds) : undefined,
      employeeId ? this.employeeService.getOneById(employeeId) : undefined,
    ]);
    if (restOfDto.password)
      restOfDto.password = PassportCrypt.encrypt(restOfDto.password);
    return {
      roles,
      employee,
      restOfDto,
    };
  }

  async authLogin(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      select: { username: true, password: true, id: true },
    });
    return user;
  }
}
