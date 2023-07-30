import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config/config';

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigType<typeof config>) => ({
    type: 'postgres',
    ...configService.database,
    autoLoadEntities: true,
    synchronize: true,
  }),
  inject: [config.KEY],
});
