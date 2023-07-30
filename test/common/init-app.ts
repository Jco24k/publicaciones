import { NestApplication } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AppPipe } from 'src/config/app-pipe';
import { DatabaseService } from 'src/database/database.service';

export const InitApp = async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: NestApplication = moduleRef.createNestApplication();
  app.useGlobalPipes(AppPipe);
  await app.init();
  const dbConnection = moduleRef
    .get<DatabaseService>(DatabaseService)
    .getConnection();
  const jwtService = moduleRef.get<JwtService>(JwtService);
  return {
    app,
    dbConnection,
    jwtService,
    moduleRef,
  };
};
