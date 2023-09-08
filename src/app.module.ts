import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { JoiValidationSchema } from './config/joi.validation';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './modules/role/role.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './modules/posts/post.module';
import { Employee } from './modules/employee/entities/employee.entity';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      validationSchema: JoiValidationSchema,
    }),
    DatabaseModule,
    CommonModule,
    EmployeeModule,
    AuthModule,
    UserModule,
    RoleModule,
    PostModule,
  ],
})
export class AppModule { }
