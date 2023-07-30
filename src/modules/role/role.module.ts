import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController } from './controller/role.controller';
import { RoleService } from './services/role.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([Role])],
  exports: [TypeOrmModule, RoleService],
})
export class RoleModule {}
