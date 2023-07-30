import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import config from 'src/config/config';

export const JwtOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [config.KEY],
  useFactory: (configService: ConfigType<typeof config>) => ({
    secret: configService.jwt.secret,
    signOptions: {
      expiresIn: configService.jwt.expire,
    },
  }),
};
