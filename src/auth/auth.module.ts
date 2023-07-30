import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptions } from './config/jwt.config';
import { RoleModule } from 'src/modules/role/role.module';
import { UserModule } from 'src/modules/user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync(JwtOptions),
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule),
  ],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
