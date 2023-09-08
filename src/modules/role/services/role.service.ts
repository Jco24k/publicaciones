import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { QueryParamsConvert } from 'src/common/dto/convert-query-params.dto';
import { PermitService } from './permit.service';

@Injectable()
export class RoleService {
  private readonly nameEntity = Role.name;

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private permitService: PermitService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) { }
  async create(createRoleDto: CreateRoleDto) {
    const roles = await this.getAndVerifyDto(createRoleDto);
    try {
      const newRole = await this.roleRepository.save({
        ...roles,
      });
      return newRole;
    } catch (error) {
      handleExceptions(error, this.nameEntity);
    }
  }

  async findAll(basicQueryParams: PaginationQueryParams) {
    const { query } = this.configService;
    const { page = query.page_number, page_size = query.page_size } =
      basicQueryParams;
    const { all, isActive = true } = basicQueryParams as QueryParamsConvert;
    const optionsToFindAll: FindManyOptions<Role> = {
      where: {
        isActive,
      },
    };

    if (!all) {
      optionsToFindAll.take = page_size;
      optionsToFindAll.skip = page_size * (page - query.min_page);
    }
    return await this.roleRepository.find(optionsToFindAll);
  }

  async getOneById(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with id '${id}' not found`);
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const roleFound = await this.getOneById(id);
    const rolesVerify = await this.getAndVerifyDto(updateRoleDto);
    try {
      const roleUpdate = await this.roleRepository.save({
        ...roleFound,
        ...rolesVerify,
      });
      return roleUpdate;
    } catch (error) {
      handleExceptions(error, this.nameEntity);
    }
  }

  async remove(id: number) {
    const role = await this.getOneById(id);
    await this.roleRepository.save({ id: role.id, isActive: false });
  }

  async getRoles(roleIds: number[] = []) {
    const roles = await this.roleRepository.find({
      where: roleIds.map((role) => {
        return { id: role };
      }),
    });
    if (roles.length !== roleIds.length) {
      const errorMsg = `Some roles were not found`;
      const notFoundRoles = roleIds
        .filter((roleId) => !roles.some((role) => role.id === roleId))
        .map((roleId) => ({
          id: roleId,
          message: `Role with id '${roleId}' not found`,
        }));

      throw new NotFoundException(notFoundRoles, errorMsg);
    }
    return roles;
  }

  async getAndVerifyDto(
    dto: Partial<CreateRoleDto> = {},
  ): Promise<Role> {
    const { permitIds = [], ...restOfDto } = dto;
    const [permits] = await Promise.all([
      permitIds?.length ? this.permitService.getPermits(permitIds) : undefined,
    ]);
    return {
      permits,
      ...restOfDto,
    } as Role;
  }
}
