import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ uniqueItems: true, minLength: 6, maxLength: 40 })
  @IsString()
  @IsEmail()
  @MinLength(6)
  @MaxLength(40)
  email: string;

  @ApiProperty({
    maxLength: 60,
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must have a Uppercase, lowercase letter and a number ',
  })
  password: string;
}
