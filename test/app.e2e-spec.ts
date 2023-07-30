import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InitApp } from './common/init-app';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { CleanDB } from './common/util/clean-db.util';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { CreatePostDto } from 'src/modules/posts/dto/create-post.dto';
import { UpdatePostDto } from 'src/modules/posts/dto/update-post.dto';
import { Post } from 'src/modules/posts/entities/post.entity';

describe('ALL-CONTROLLER (e2e)', () => {
  let app: INestApplication;
  let dbConnection: DataSource;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  let moduleRef: TestingModule;
  let token: string;
  let utlimoPost: string;
  let ultimoUser: string;
  beforeAll(async () => {
    const {
      app: appInit,
      dbConnection: dbConnectionInit,
      jwtService: jwts,
      moduleRef: modRef,
    } = await InitApp();
    app = appInit;
    dbConnection = await dbConnectionInit;
    jwtService = jwts;
    moduleRef = modRef;
  });

  afterAll(async () => {
    await CleanDB(dbConnection);
    await moduleRef.close();
    await app.close();
  });

  describe('Auth Controller (e2e)', () => {
    const pathControllerAuth = '/' + CurrentPath.AUTH;
    // const pathControllerUser = '/' + CurrentPath.USER;
    // const pathControllerRole = '/' + CurrentPath.ROLE;

    it('should signIn Auth return 200 OK', async () => {
      const user = await request(app.getHttpServer())
        .post(pathControllerAuth + '/login')
        .send({
          username: process.env.USER_ADMIN,
          password: process.env.PASS_ADMIN,
        })
        .expect(200);
      token = user.body.token;
    });

    it('should signIn Auth return 401 UNAUTHORIZED', async () => {
      //EXCEPTION POR CONTRASEÑA INCORRECTA
      return await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'UsEr_OnE01', password: '1afasAasdfasfasf' })
        .auth(token, { type: 'bearer' })
        .expect(401);
    });

    it('should create Auth return 201 NOT FOUND', async () => {
      return await request(app.getHttpServer())
        .post(pathControllerAuth + '/signup')
        .send({
          username: 'testststEas',
          email: 'test2@test.com',
          password: 'asda123AsaA123eaa',
          roles: [1123123],
        } as CreateUserDto)
        .auth(token, { type: 'bearer' })
        .expect(404);
    });

    it('should create Auth return 201 CREATED', async () => {
      const user = await request(app.getHttpServer())
        .post(pathControllerAuth + '/signup')
        .send({
          username: 'testststEas',
          email: 'test2@test.com',
          password: 'asda123AsaA123eaa',
          roles: [38],
        } as CreateUserDto)
        .auth(token, { type: 'bearer' })
        .expect(201);
      ultimoUser = user.body.id;
    });
  });

  describe('POST Controller (e2e)', () => {
    const pathControllerPost = '/' + CurrentPath.POST;
    it('should create POST return 201 CREATED', async () => {
      const post = await request(app.getHttpServer())
        .post(pathControllerPost)
        .send({
          title: 'TEST',
          content: 'TEST',
        } as CreatePostDto)
        .auth(token, { type: 'bearer' })
        .expect(201);
      utlimoPost = post.body.id;
    });
    it('should delete POST return 200 OK', async () => {
      return await request(app.getHttpServer())
        .delete(pathControllerPost + '/' + utlimoPost)
        .auth(token, { type: 'bearer' })
        .expect(200);
    });

    it('should delete POST return 401 UNAUTHORIZED', async () => {
      return await request(app.getHttpServer())
        .delete(pathControllerPost + '/' + utlimoPost)
        .auth(ultimoUser, { type: 'bearer' })
        .expect(401);
    });
    it('should patch POST return 401 UNAUTHORIZED', async () => {
      return await request(app.getHttpServer())
        .patch(pathControllerPost + '/1')
        .send({
          title: 'TEST',
          content: 'TEST',
        } as UpdatePostDto)
        .expect(401);
    });
    describe('GET Controller (e2e)', () => {
      const response = async (path = '') => {
        return await request(app.getHttpServer())
          .get(pathControllerPost + path)
          .auth(token, { type: 'bearer' });
      };
      it('(all) check which post is not deleted 200 OK', async () => {
        const { body } = await response();
        const verify = await body.every((x: Post) => x.created_at !== null);
        expect(verify).toBe(true);
      });
      it('(get) check that the publication has a "create_at" field 200 OK', async () => {
        const {
          body: { created_at },
        } = await response('/' + utlimoPost);
        expect(created_at).toBeDefined();
      });
    });
  });
});
