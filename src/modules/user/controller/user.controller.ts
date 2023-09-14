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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiControllerImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { hasUserAdmin } from 'src/common/util/has-user-admin.utility';
import { ValidPermits } from 'src/common/permit/valid-permit';

@ApiTags(CurrentPath.USER.toUpperCase())
@Controller(CurrentPath.USER)
@ApiBearerAuth()
@ApiControllerImplementation()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOkResponseImplementation({ type: [User], method: 'get' })
  @Get()
  @Auth({
    roles: [ValidPermits.READ_USER],
  })
  findAll(
    @Query(PaginationQueryParamsPipe(PaginationQueryParams))
    query: PaginationQueryParams,
  ) {
    return this.userService.findAll(query);
  }

  @ApiOkResponseImplementation({ type: User, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  @Auth({
    roles: [ValidPermits.READ_USER],
    sameUser: true,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.userService.getOneById(id, hasUserAdmin(user) ? false : true);
  }

  @ApiOkResponseImplementation({ type: User, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch(':id')
  @Auth({
    roles: [ValidPermits.UPDATE_USER],
    sameUser: true,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOkResponseImplementation({ type: User, method: 'update' })
  @ApiNotFoundImplementation()
  @Auth({
    roles: [ValidPermits.UPDATE_USER],
  })
  @Patch('admin/:id')
  updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, updateUserDto);
  }

  @Auth({
    roles: [ValidPermits.DELETE_USER],
  })
  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
