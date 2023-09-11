import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppPipe } from './config/app-pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Booststrap');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(AppPipe);

  const configSwagger = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'headers',
    })
    .setTitle('Backend with Github Actions (self-hosted) and  Docker! asdasd')
    .setDescription(
      `Credentials: </br>{</br>
      &nbsp;&nbsp;"username": "${process.env.USER_ADMIN}",</br>
      &nbsp;&nbsp;"password": "${process.env.PASS_ADMIN}"</br>
    }`,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  logger.log(`App running on port ${process.env.PORT || 3000}`);
}
bootstrap();
