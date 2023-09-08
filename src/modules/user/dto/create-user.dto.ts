import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueItemArrayPipe } from 'src/common/validators/unique-item-array.decorator';

export class CreateUserDto {
  @ApiProperty({ uniqueItems: true, minLength: 6, maxLength: 40 })
  @IsString()
  @MinLength(6)
  @MaxLength(40)
  username: string;

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

  @ApiProperty({ isArray: true, type: () => Number })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @UniqueItemArrayPipe('roles', {
    message: 'roles contains duplicate elements',
  })
  rolesIds: number[];

  @ApiProperty({ type: () => Number })
  @IsNumber()
  @Min(1)
  employeeId: number;
}
