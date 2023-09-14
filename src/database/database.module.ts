import { Module } from '@nestjs/common';
import { DatabaseProvider } from './services/database.provider';
import { DatabaseService } from './services/database.service';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { EmployeeModule } from 'src/modules/employee/employee.module';

@Module({
  imports: [DatabaseProvider, RoleModule, UserModule, EmployeeModule],
  providers: [DatabaseService],
  exports: [DatabaseProvider, DatabaseService],
})
export class DatabaseModule { }
