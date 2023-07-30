import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { RoleModule } from '../role/role.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User]), RoleModule],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
