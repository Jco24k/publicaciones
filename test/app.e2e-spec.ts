import { HttpStatus, INestApplication } from '@nestjs/common';
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
import { createRequest } from './common/util/request-method.util';
import { employeeDtoStub } from 'src/modules/seed/dto/employee.dto.stub';
import { verifyRequest } from './common/test/verify-request';
import { CreateEmployeeDto } from 'src/modules/employee/dto/create-employee.dto';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { UpdateEmployeeDto } from 'src/modules/employee/dto/update-employee.dto';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { roleDtoStub } from 'src/modules/seed/dto/role.dto.stub';
import { CreateRoleDto } from 'src/modules/role/dto/create-role.dto';
import { Role } from 'src/modules/role/entities/role.entity';
import { QueryPararmsRole } from 'src/modules/role/dto/query/query-params-role';
import { UpdateRoleDto } from 'src/modules/role/dto/update-role.dto';
import { Permit } from 'src/modules/role/entities/permit.entity';

jest.setTimeout(60000);
describe('ALL-CONTROLLER (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;
  let moduleRef: TestingModule;
  let token: string;
  let utlimoPost: string;
  let ultimoUser: string;
  let employeeId: number;
  let roleId: number;
  let requestHelper: any;
  beforeAll(async () => {
    const {
      app: appInit,
      dbConnection: dbConnectionInit,
      jwtService: jwts,
      moduleRef: modRef,
    } = await InitApp();
    app = appInit;
    dataSource = await dbConnectionInit;
    jwtService = jwts;
    moduleRef = modRef;
    await CleanDB(dataSource);
    requestHelper = await createRequest(app);
    const { body } = await request(app.getHttpServer())
      .post("/" + CurrentPath.AUTH + '/login')
      .send({
        username: process.env.USER_ADMIN,
        password: process.env.PASS_ADMIN,
      }).expect(200);
    token = body.token;
  });

  afterAll(async () => {
    await CleanDB(dataSource);
    await moduleRef.close();
    await app.close();
  });
  describe('Employee (e2e)', () => {
    const url = '/' + CurrentPath.EMPLOYEE;
    const idNotFound = 99999
    describe('GET-ALL', () => {
      const page_size = 20;
      const min_page = 1;
      const detAll = async ({ queryParams }) => {
        return await requestHelper.getAll({
          url,
          jwt: token,
          query: queryParams,
        });
      };
      it('Get list without query-params with all permissions', async () => {
        await verifyRequest.simpleGetAll<Employee, PaginationQueryParams>({
          def: detAll,
          entity: Employee,
          dataSource,
          filter: {
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
      });
      it('Get all list with all permissions', async () => {
        await verifyRequest.simpleGetAll<Employee, Partial<PaginationQueryParams>>({
          def: detAll,
          entity: Employee,
          dataSource,
          queryParams: { all: true },
        });
      });
      it('Get list only actives with all permissions', async () => {
        await verifyRequest.simpleGetAll<Employee, Partial<PaginationQueryParams>>({
          def: detAll,
          entity: Employee,
          dataSource,
          queryParams: { isActive: true },
          filter: {
            where: { isActive: true },
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
      });
      it('Get list only inactives with all permissions', async () => {
        await verifyRequest.simpleGetAll<Employee, Partial<PaginationQueryParams>>({
          def: detAll,
          entity: Employee,
          dataSource,
          queryParams: { isActive: false },
          filter: {
            where: { isActive: false },
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
      });
    });
    describe('POST', () => {
      const reqPost = async ({ body, jwt }) => {
        return await requestHelper.post({
          url,
          body,
          jwt,
        });
      };
      it('All correct params and correct permissions', async () => {
        const stub = employeeDtoStub();
        const data = await verifyRequest.simplePostAndPut<
          CreateEmployeeDto,
          Employee
        >({
          def: reqPost,
          jwt: token,
          request_body: stub,
          entity: Employee,
          dataSource,
          criterionWhere: { where: { name: stub.name } },
        });
        employeeId = data.id;
      });
      it('All required parameters undefined', async () => {
        const stub = employeeDtoStub();
        stub.name = undefined;
        await verifyRequest.simplePostAndPut<CreateEmployeeDto, Employee>({
          def: reqPost,
          jwt: token,
          request_body: stub,
          entity: Employee,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      it('Without optional params and correct permissions', async () => {
        const stub = employeeDtoStub();
        stub.last_name = undefined;
        await verifyRequest.simplePostAndPut<CreateEmployeeDto, Employee>({
          def: reqPost,
          jwt: token,
          request_body: stub,
          entity: Employee,
          dataSource,
          criterionWhere: { where: { name: stub.name } },
        });
      });
    });
    describe('PATCH', () => {
      const reqPatch = async ({ body, jwt, param }) => {
        return await requestHelper.patch({
          url,
          body,
          jwt,
          param,
        });
      };
      it('All correct params and correct permissions', async () => {
        const stub = employeeDtoStub() as UpdateEmployeeDto;
        stub.isActive = true;
        await verifyRequest.simplePostAndPut<UpdateEmployeeDto, Employee>({
          def: reqPatch,
          jwt: token,
          request_body: stub,
          entity: Employee,
          param: employeeId,
          dataSource,
          statusCode: 200,
          criterionWhere: { where: { name: stub.name } },
        });
      });
      it('Inexisting id and all correct params with all permissions', async () => {
        const stub = employeeDtoStub() as UpdateEmployeeDto;
        stub.isActive = true;
        await verifyRequest.simplePostAndPut<UpdateEmployeeDto, Employee>({
          def: reqPatch,
          jwt: token,
          request_body: stub,
          entity: Employee,
          param: idNotFound,
          dataSource,
          statusCode: HttpStatus.NOT_FOUND,
          criterionWhere: { where: { name: stub.name } },
        });
      });
    });
    describe('GET-ONE', () => {
      const reqGetOne = async ({ jwt, search_id }) => {
        return await requestHelper.getOne({
          url,
          search_id,
          jwt,
        });
      };
      it('Existing id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Employee>({
          def: reqGetOne,
          jwt: token,
          entity: Employee,
          dataSource,
          search_id: employeeId,
        });
      });
      it('Inexisting id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Employee>({
          def: reqGetOne,
          jwt: token,
          entity: Employee,
          search_id: idNotFound,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
    });
    describe('DELETE', () => {
      const detDelete = async ({ jwt, search_id }) => {
        return await requestHelper.delete({
          url,
          search_id,
          jwt,
        });
      };
      it('Existing id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Employee>({
          def: detDelete,
          jwt: token,
          entity: Employee,
          dataSource,
          search_id: employeeId,
          addWhere: { isActive: false },
        });
      });
      it('Inexisting id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Employee>({
          def: detDelete,
          jwt: token,
          entity: Employee,
          search_id: idNotFound,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
    });

  });
  describe('Permit (e2e)', () => {
    const url = '/' + CurrentPath.PERMIT;
    const idNotFound = 99999
    describe('GET-ALL', () => {
      const page_size = 20;
      const min_page = 1;
      const detAll = async ({ queryParams }) => {
        return await requestHelper.getAll({
          url,
          jwt: token,
          query: queryParams,
        });
      };
      it('Get list without query-params with all permissions', async () => {
        const permits = await verifyRequest.simpleGetAll<Permit, QueryPararmsRole>({
          def: detAll,
          entity: Permit,
          dataSource,
          filter: {
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
        expect(permits.length).not.toBe(0)
      });
      it('Get all list with all permissions', async () => {
        await verifyRequest.simpleGetAll<Permit, Partial<QueryPararmsRole>>({
          def: detAll,
          entity: Permit,
          dataSource,
          queryParams: { all: true },
        });
      });
    });
  });
  describe('Role (e2e)', () => {
    const url = '/' + CurrentPath.ROLE;
    const idNotFound = 99999
    describe('GET-ALL', () => {
      const page_size = 20;
      const min_page = 1;
      const detAll = async ({ queryParams }) => {
        return await requestHelper.getAll({
          url,
          jwt: token,
          query: queryParams,
        });
      };
      it('Get list without query-params with all permissions', async () => {
        await verifyRequest.simpleGetAll<Role, PaginationQueryParams>({
          def: detAll,
          entity: Role,
          dataSource,
          filter: {
            where: { isActive: true },
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
      });
      it('Get list only actives with all permissions', async () => {
        await verifyRequest.simpleGetAll<Role, Partial<PaginationQueryParams>>({
          def: detAll,
          entity: Role,
          dataSource,
          queryParams: { isActive: true },
          filter: {
            where: { isActive: true },
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
      });
      it('Get list only inactives with all permissions', async () => {
        await verifyRequest.simpleGetAll<Role, Partial<PaginationQueryParams>>({
          def: detAll,
          entity: Role,
          dataSource,
          queryParams: { isActive: false },
          filter: {
            where: { isActive: false },
            take: page_size,
            skip: page_size * (1 - min_page),
          },
        });
      });
    });
    describe('POST', () => {
      const reqPost = async ({ body, jwt }) => {
        return await requestHelper.post({
          url,
          body,
          jwt,
        });
      };
      it('All correct params and correct permissions', async () => {
        const stub = roleDtoStub();
        const data = await verifyRequest.simplePostAndPut<
          CreateRoleDto,
          Role
        >({
          def: reqPost,
          jwt: token,
          request_body: stub,
          entity: Role,
          dataSource,
          criterionWhere: { where: { name: stub.name } },
        });
        roleId = data.id;
      });
      it('All required parameters undefined', async () => {
        const stub = roleDtoStub();
        stub.name = undefined;
        await verifyRequest.simplePostAndPut<CreateRoleDto, Role>({
          def: reqPost,
          jwt: token,
          request_body: stub,
          entity: Role,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      it('Without optional params and correct permissions', async () => {
        const stub = roleDtoStub();
        stub.permitIds = undefined;
        await verifyRequest.simplePostAndPut<CreateRoleDto, Role>({
          def: reqPost,
          jwt: token,
          request_body: stub,
          entity: Role,
          dataSource,
          criterionWhere: { where: { name: stub.name } },
        });
      });
    });
    describe('PATCH', () => {
      const reqPatch = async ({ body, jwt, param }) => {
        return await requestHelper.patch({
          url,
          body,
          jwt,
          param,
        });
      };
      it('All correct params and correct permissions', async () => {
        const stub = roleDtoStub() as UpdateRoleDto;
        stub.isActive = true;
        await verifyRequest.simplePostAndPut<UpdateRoleDto, Role>({
          def: reqPatch,
          jwt: token,
          request_body: stub,
          entity: Role,
          param: roleId,
          dataSource,
          statusCode: 200,
          criterionWhere: { where: { name: stub.name } },
        });
      });
      it('Inexisting id and all correct params with all permissions', async () => {
        const stub = roleDtoStub() as UpdateRoleDto;
        stub.isActive = true;
        await verifyRequest.simplePostAndPut<UpdateRoleDto, Role>({
          def: reqPatch,
          jwt: token,
          request_body: stub,
          entity: Role,
          param: idNotFound,
          dataSource,
          statusCode: HttpStatus.NOT_FOUND,
          criterionWhere: { where: { name: stub.name } },
        });
      });
    });
    describe('GET-ONE', () => {
      const reqGetOne = async ({ jwt, search_id }) => {
        return await requestHelper.getOne({
          url,
          search_id,
          jwt,
        });
      };
      it('Existing id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Role>({
          def: reqGetOne,
          jwt: token,
          entity: Role,
          dataSource,
          search_id: roleId,
        });
      });
      it('Inexisting id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Role>({
          def: reqGetOne,
          jwt: token,
          entity: Role,
          search_id: idNotFound,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
    });
    describe('DELETE', () => {
      const detDelete = async ({ jwt, search_id }) => {
        return await requestHelper.delete({
          url,
          search_id,
          jwt,
        });
      };
      it('Existing id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Role>({
          def: detDelete,
          jwt: token,
          entity: Role,
          dataSource,
          search_id: roleId,
          addWhere: { isActive: false },
        });
      });
      it('Inexisting id with all permissions', async () => {
        await verifyRequest.simpleGetOneAndDelete<Role>({
          def: detDelete,
          jwt: token,
          entity: Role,
          search_id: idNotFound,
          statusCode: HttpStatus.NOT_FOUND,
        });
      });
    });
 
  });
  describe('Auth Controller (e2e)', () => {
    const pathControllerAuth = '/' + CurrentPath.AUTH;
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
});
