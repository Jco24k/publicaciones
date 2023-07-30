import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ uniqueItems: true, maxLength: 40 })
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  title: string;

  @ApiPropertyOptional({ nullable: true, maxLength: 250 })
  @IsString()
  @MaxLength(250)
  @IsOptional()
  content?: string;
}
