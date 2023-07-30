import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleController } from './controller/role.controller';
import { RoleService } from './services/role.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([Role]), forwardRef(() => AuthModule)],
  exports: [TypeOrmModule, RoleService],
})
export class RoleModule {}
