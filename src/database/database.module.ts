import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { DatabaseService } from './database.service';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [DatabaseProvider, RoleModule, UserModule],
  providers: [DatabaseService],
  exports: [DatabaseProvider, DatabaseService],
})
export class DatabaseModule {}
