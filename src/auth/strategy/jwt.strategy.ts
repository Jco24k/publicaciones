import { Inject, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import config from 'src/config/config';
import { UserService } from 'src/modules/user/services/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(config.KEY)
    configService: ConfigType<typeof config>,
    private readonly userRepository: UserService,
  ) {
    super({
      secretOrKey: configService.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = await this.userRepository.getOneById(id);
    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');
    return user;
  }
}
