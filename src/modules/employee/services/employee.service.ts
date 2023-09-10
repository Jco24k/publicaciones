import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsRelations, Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';
import { QueryParamsConvert } from 'src/common/dto/convert-query-params.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  private readonly entityName = Employee.name;
  private readonly relationsEntity: FindOptionsRelations<Employee> = {
  };
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async findAll(queryParams: PaginationQueryParams) {
    const { query } = this.configService;
    const { page = query.page_number, page_size = query.page_size } =
      queryParams;
    const { all, isActive, relations } = queryParams as QueryParamsConvert;
    const optionsToFindAll: FindManyOptions<Employee> = {
      where: {
        isActive,
      },
    };
    if (!all) {
      optionsToFindAll.take = page_size;
      optionsToFindAll.skip = page_size * (page - query.min_page);
    }
    if (relations) optionsToFindAll.relations = this.relationsEntity;
    return await this.employeeRepository.find(optionsToFindAll);
  }

  async create(createUserDto: CreateEmployeeDto) {
    try {
      const register = await this.employeeRepository.save({
        ...createUserDto,
      });
      return register;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }
  async getOneById(id: number, relations = true) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      ...(relations && { relations: this.relationsEntity }),
    });
    if (!employee) throw new NotFoundException(`Employee with id '${id}' not found`);
    return employee;
  }

  async update(id: number, updateDto: UpdateEmployeeDto) {
    const empFound = await this.getOneById(id, false);
    try {
      const employeUpdated = await this.employeeRepository.save({
        ...empFound,
        ...updateDto,
      });
      return employeUpdated;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }

  async remove(id: number) {
    const user = await this.getOneById(id, false);
    await this.employeeRepository.save({ id: user.id, isActive: false });
  }

}
