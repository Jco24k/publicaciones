import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { JoiValidationSchema } from './config/joi.validation';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),
    DatabaseModule,
    CommonModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
