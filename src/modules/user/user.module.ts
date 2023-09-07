import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoleModule),
  ],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
