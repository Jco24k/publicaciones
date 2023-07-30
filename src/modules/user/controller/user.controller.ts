import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { UserService } from '../services/user.service';
import { User } from '../entities/User.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';

@ApiTags(CurrentPath.USER.toUpperCase())
@Controller(CurrentPath.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponseImplementation({ type: [User], method: 'get' })
  @Get()
  findAll(
    @Query(PaginationQueryParamsPipe(PaginationQueryParams))
    query: PaginationQueryParams,
  ) {
    return this.userService.findAll(query);
  }

  @ApiOkResponseImplementation({ type: User, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneById(id);
  }

  @ApiOkResponseImplementation({ type: User, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOkResponseImplementation({ type: User, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch('admin/:id')
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, updateUserDto);
  }

  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
