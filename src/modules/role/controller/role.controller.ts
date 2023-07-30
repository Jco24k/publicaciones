import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import {
  ApiCreatedResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';

@ApiTags('Role (roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponseImplementation(Role)
  @Post()
  create(@Body() createRolDto: CreateRoleDto) {
    return this.roleService.create(createRolDto);
  }

  @ApiOkResponseImplementation({ type: [Role], method: 'get' })
  @Get()
  findAll(
    @Query(PaginationQueryParamsPipe(PaginationQueryParams))
    query: PaginationQueryParams,
  ) {
    return this.roleService.findAll(query);
  }

  @ApiOkResponseImplementation({ type: Role, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getOneById(id);
  }

  @ApiOkResponseImplementation({ type: Role, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
