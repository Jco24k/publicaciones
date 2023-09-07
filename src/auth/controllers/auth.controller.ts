import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../dto/auth.dto';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import {
  ApiControllerImplementation,
  ApiCreatedResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Auth } from '../decorators/auth.decorator';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';

@ApiTags(CurrentPath.AUTH.toUpperCase())
@Controller(CurrentPath.AUTH)
@ApiBearerAuth()
@ApiControllerImplementation()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthResponseDto,
    description: 'Auth successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Incorrect credentials',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is inactive',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return await this.authService.authLogin(authDto);
  }

  @ApiCreatedResponseImplementation(User)
  @Post('signup')
  @Auth({
    roles: [RolesValid.ADMINISTRADOR],
  })
  create(@Body() createRolDto: CreateUserDto) {
    return this.authService.create(createRolDto);
  }
}
