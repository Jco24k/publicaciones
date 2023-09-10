import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ minLength: 1, maxLength: 40 })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  name: string;

  @ApiProperty({ minLength: 1, maxLength: 40 })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  last_name: string;

  @ApiProperty({
    maxLength: 8,
    minLength: 8,
  })
  @IsNumberString()
  @Length(8, 8)
  dni: string;

}
