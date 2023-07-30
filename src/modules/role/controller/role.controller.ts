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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import {
  ApiControllerImplementation,
  ApiCreatedResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesValid } from '../entities/enum/roles-valid.enum';

@ApiTags(CurrentPath.ROLE.toUpperCase())
@Controller(CurrentPath.ROLE)
@ApiBearerAuth()
@ApiControllerImplementation()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponseImplementation(Role)
  @Post()
  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  create(@Body() createRolDto: CreateRoleDto) {
    return this.roleService.create(createRolDto);
  }

  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  @ApiOkResponseImplementation({ type: [Role], method: 'get' })
  @Get()
  findAll(
    @Query(PaginationQueryParamsPipe(PaginationQueryParams))
    query: PaginationQueryParams,
  ) {
    return this.roleService.findAll(query);
  }

  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  @ApiOkResponseImplementation({ type: Role, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getOneById(id);
  }

  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  @ApiOkResponseImplementation({ type: Role, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
