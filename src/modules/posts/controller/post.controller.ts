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
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { PostService } from '../services/post.service';
import { Post as PostEntity } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { User } from 'src/modules/user/entities/User.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { QueryPararmsPost } from 'src/common/dto/query-params-post';

@ApiTags(CurrentPath.POST.toUpperCase())
@Controller(CurrentPath.POST)
@ApiControllerImplementation()
@ApiBearerAuth()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth({
    roles: [
      RolesValid.ADMINISTRADOR,
      RolesValid.SUPER_USER,
      RolesValid.USER,
      RolesValid.TEST,
      RolesValid.TEST_TWO,
      RolesValid.TEST_THREE,
      RolesValid.TEST_FOUR,
    ],
  })
  @ApiOkResponseImplementation({ type: [PostEntity], method: 'get' })
  @Get()
  findAll(
    @Query(PaginationQueryParamsPipe(QueryPararmsPost))
    query: QueryPararmsPost,
  ) {
    return this.postService.findAll(query);
  }

  @ApiCreatedResponseImplementation(User)
  @Post()
  @Auth({
    roles: [
      RolesValid.ADMINISTRADOR,
      RolesValid.SUPER_USER,
      RolesValid.USER,
      RolesValid.TEST,
      RolesValid.TEST_TWO,
      RolesValid.TEST_THREE,
      RolesValid.TEST_FOUR,
    ],
  })
  create(@Body() createRolDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createRolDto, user);
  }

  @ApiOkResponseImplementation({ type: PostEntity, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  @Auth({
    roles: [],
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getOneById({
      id,
    });
  }

  @ApiOkResponseImplementation({ type: PostEntity, method: 'update' })
  @ApiNotFoundImplementation()
  @Auth({
    roles: [],
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  @ApiOkResponseImplementation({ method: 'delete' })
  @ApiNotFoundImplementation()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.changeState(id);
  }

  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  @ApiOkResponseImplementation({ method: 'update' })
  @ApiNotFoundImplementation()
  @Patch('restore/:id')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.postService.changeState(id, true);
  }
}
