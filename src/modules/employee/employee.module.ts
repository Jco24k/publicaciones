import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeController } from './controller/employee.controller';
import { EmployeeService } from './services/employee.service';
import { RoleModule } from '../role/role.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [
    TypeOrmModule.forFeature([Employee]),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule, EmployeeService],
})
export class EmployeeModule {}
