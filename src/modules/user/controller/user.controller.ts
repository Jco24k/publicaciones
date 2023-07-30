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
import {
  ApiCreatedResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { UserService } from '../services/user.service';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags(CurrentPath.USER.toUpperCase())
@Controller(CurrentPath.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponseImplementation(User)
  @Post()
  create(@Body() createRolDto: CreateUserDto) {
    return this.userService.create(createRolDto);
  }

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

  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
