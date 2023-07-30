import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  Repository,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ConfigType } from '@nestjs/config';
import { Post } from '../entities/post.entity';
import config from 'src/config/config';
import { CreatePostDto } from '../dto/create-post.dto';
import { handleExceptions } from 'src/common/errors/handleExceptions';
import { QueryParamsConvert } from 'src/common/dto/convert-query-params.dto';
import { IFindOneWithUser } from 'src/auth/interfaces/find-one-by-id-params.interface';
import { UpdatePostDto } from '../dto/update-post.dto';
import { QueryPararmsPost } from 'src/common/dto/query-params-post';

@Injectable()
export class PostService {
  private readonly relations: FindOptionsRelations<Post> = {
    user: true,
  };
  private readonly selects: FindOptionsSelect<Post> = {
    id: true,
    title: true,
    content: true,
    delete_at: true,
    created_at: true,
    updated_at: true,
    user: {
      id: true,
      email: true,
    },
  };
  private readonly entityName = Post.name;
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {}

  async create(createPostDto: CreatePostDto, request_user: Partial<User>) {
    try {
      const {
        user: { id, email },
        ...restPost
      } = await this.postRepository.save({
        ...createPostDto,
        user: request_user,
      } as Post);

      return { ...restPost, user: { id, email } };
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }

  async findAll(queryParams: QueryPararmsPost) {
    const { query } = this.configService;
    const {
      page = query.page_number,
      page_size = query.page_size,
      user_id,
    } = queryParams;
    const { all, relations } = queryParams as QueryParamsConvert;
    const optionsToFindAll: FindManyOptions<Post> = {
      where: {
        ...(user_id && { user: { id: user_id } }),
      },
      relations: relations ? this.relations : undefined,
      select: this.selects,
    };
    if (!all) {
      optionsToFindAll.take = page_size;
      optionsToFindAll.skip = page_size * (page - query.min_page);
    }
    if (relations) optionsToFindAll.relations = this.relations;
    return await this.postRepository.find(optionsToFindAll);
  }
  async getOneById({ id, relations = true }: IFindOneWithUser) {
    const postFind = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: relations ? this.relations : undefined,
      select: this.selects,
      withDeleted: true,
    });
    if (!postFind)
      throw new NotFoundException(`Post with id '${id}' not found`);
    return postFind;
  }

  async update(id: number, updatePost: UpdatePostDto) {
    const postFind = await this.getOneById({
      id,
    });
    try {
      const postUpdated = await this.postRepository.save({
        ...postFind,
        ...updatePost,
      });
      return postUpdated;
    } catch (error) {
      handleExceptions(error, this.entityName);
    }
  }

  async changeState(id: number, option = false) {
    const post = await this.getOneById({
      id,
      relations: false,
    });
    if (option)
      await this.postRepository.save({ id: post.id, delete_at: null });
    else await this.postRepository.softRemove(post);
  }
}
