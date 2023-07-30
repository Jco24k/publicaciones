import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/services/user.service';
import { PassportCrypt } from 'src/common/util/passport-crypt';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async authLogin(authUserDto: AuthDto) {
    const { password, username } = authUserDto;
    const user = await this.userRepository.authLogin(username);
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (username)');
    }
    if (!PassportCrypt.verifyPassword(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    delete user.password;
    return {
      ...user,
      token: this.getJwt({ id: user.id }),
    };
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.create(createUserDto);
  }

  private getJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
