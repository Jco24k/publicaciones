import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiControllerImplementation,
  ApiCreatedResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../entities/employee.entity';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { hasUserAdmin } from 'src/common/util/has-user-admin.utility';
import { ValidPermits } from 'src/common/permit/valid-permit';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

@ApiTags(CurrentPath.EMPLOYEE.toUpperCase())
@Controller(CurrentPath.EMPLOYEE)
@ApiBearerAuth()
@ApiControllerImplementation()
export class EmployeeController {
  constructor(private readonly service: EmployeeService) { }

  @ApiCreatedResponseImplementation(Employee)
  @Post()
  @Auth({
    roles: [ValidPermits.CREATE_EMPLOYEE],
  })
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @ApiOkResponseImplementation({ type: [Employee], method: 'get' })
  @Get()
  @Auth({
    roles: [ValidPermits.READ_EMPLOYEE],
  })
  findAll(
    @Query(PaginationQueryParamsPipe(PaginationQueryParams))
    query: PaginationQueryParams,
  ) {
    return this.service.findAll(query);
  }

  @ApiOkResponseImplementation({ type: Employee, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  @Auth({
    roles: [ValidPermits.READ_EMPLOYEE],
    sameUser: true,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: Employee) {
    return this.service.getOneById(id, hasUserAdmin(user) ? false : true);
  }

  @ApiOkResponseImplementation({ type: Employee, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch(':id')
  @Auth({
    roles: [ValidPermits.UPDATE_EMPLOYEE],
    sameUser: true,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateEmployeeDto,
  ) {
    return this.service.update(id, updateUserDto);
  }

  @Auth({
    roles: [ValidPermits.DELETE_EMPLOYEE],
  })
  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
