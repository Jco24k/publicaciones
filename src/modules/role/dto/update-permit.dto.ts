import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdatePermitDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    maxLength: 40,
  })
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  description: string;
}
