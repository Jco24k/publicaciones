import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController } from './controller/role.controller';
import { RoleService } from './services/role.service';
import { AuthModule } from 'src/auth/auth.module';
import { PermitService } from './services/permit.service';
import { Permit } from './entities/permit.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService, PermitService],
  imports: [TypeOrmModule.forFeature([Role, Permit]), forwardRef(() => AuthModule)],
  exports: [TypeOrmModule, RoleService, PermitService],
})
export class RoleModule { }
