import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    type: 'string',
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
  })
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  password: string;
}
