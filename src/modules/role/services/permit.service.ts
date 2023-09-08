import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { QueryParamsConvert } from 'src/common/dto/convert-query-params.dto';
import { Permit } from '../entities/permit.entity';
import { UpdatePermitDto } from '../dto/update-permit.dto';
import { QueryPararmsRole } from '../dto/query/query-params-role';

@Injectable()
export class PermitService {
  private readonly nameEntity = Permit.name;

  constructor(
    @InjectRepository(Permit)
    private permitRepository: Repository<Permit>,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) { }

  async findAll(basicQueryParams: QueryPararmsRole) {
    const { query } = this.configService;
    const { role_id, page = query.page_number, page_size = query.page_size } =
      basicQueryParams;
    const { all } = basicQueryParams as QueryParamsConvert;
    const optionsToFindAll: FindManyOptions<Permit> = {
      where: {
        ...(role_id && { roles: { id: role_id } }),
      }
    };

    if (!all) {
      optionsToFindAll.take = page_size;
      optionsToFindAll.skip = page_size * (page - query.min_page);
    }
    return await this.permitRepository.find(optionsToFindAll);
  }

  async getOneById(id: number) {
    const Permit = await this.permitRepository.findOneBy({ id });
    if (!Permit) throw new NotFoundException(`Permit with id '${id}' not found`);
    return Permit;
  }

  async update(id: number, updatePermitDto: UpdatePermitDto) {
    const permit = await this.getOneById(id);
    try {
      const permitUpdated = await this.permitRepository.save({
        ...permit,
        ...updatePermitDto,
      });
      return permitUpdated;
    } catch (error) {
      handleExceptions(error, this.nameEntity);
    }
  }


  async getPermits(permitIds: number[] = []) {
    const permits = await this.permitRepository.find({
      where: permitIds.map((Permit) => {
        return { id: Permit };
      }),
    });
    if (permits.length !== permitIds.length) {
      const errorMsg = `Some Permits were not found`;
      const notFoundPermits = permitIds
        .filter((permitId) => !permits.some((pert) => pert.id === permitId))
        .map((idPerm) => ({
          id: idPerm,
          message: `Permit with id '${idPerm}' not found`,
        }));

      throw new NotFoundException(notFoundPermits, errorMsg);
    }
    return permits;
  }


}
