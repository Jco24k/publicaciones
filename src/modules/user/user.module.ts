import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';

@Module({
  controllers: [],
  providers: [],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [],
})
export class UserModule {}
