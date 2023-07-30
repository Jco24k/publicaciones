import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RoleService } from '../../role/services/role.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { PassportCrypt } from 'src/common/utli/encrypter';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { QueryParamsConvert } from 'src/common/dto/convert-query-params.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly entityName = User.name;
  private readonly relationsEntity: FindOptionsRelations<User> = {
    roles: true,
  };
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

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
  async getOneById(id, relations = true) {
    const user = await this.userRepository.findOne({
      where: { id },
      ...(relations && { relations: this.relationsEntity }),
    });
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    return user;
  }

  async update(id: number, createUserDto: UpdateUserDto) {
    const user = await this.getOneById(id);
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

  async updateRole(id: number, createUserDto: UpdateUserDto) {
    const user = await this.getOneById(id);
    const { roles } = await this.getAndVerifyDto(createUserDto);
    try {
      const userUpdate = await this.userRepository.save({
        ...user,
        roles,
      });
      return userUpdate;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async deleteOneById(id: number, request_user: User) {
    const user = await this.getOneById({
      id,
      request_user,
      relations: false,
    });
    await this.userRepository.save({ id: user.id, isActive: false });
  }

  async getAndVerifyDto(dto: Partial<CreateUserDto> = {}) {
    const { roles, ...restOfDto } = dto;
    const promises = await Promise.all([
      roles?.length ? this.roleService.getRoles(roles) : undefined,
    ]);
    if (restOfDto.password)
      restOfDto.password = PassportCrypt.encrypt(restOfDto.password);
    return {
      roles: promises[0],
      restOfDto,
    };
  }
}
