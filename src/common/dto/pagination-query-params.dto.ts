import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidStringNumber } from '../validators/valid-string-number.decorator';
import { IsOneDefined } from '../validators/is-one-defined.decorator';

export class PaginationQueryParams {
  @ApiProperty({ required: false, default: process.env.PAGE, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page: number;

  @ApiProperty({ required: false, default: process.env.PAGE_SIZE, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page_size: number;

  @ApiPropertyOptional({
    required: false,
    enum: ['true', 'false', '1', '0'],
    description: `If you send it, return all registers without pagination. Cannot use at the same time that page and page_size query params`,
  })
  @IsValidStringNumber()
  @IsOneDefined(['all', 'page'])
  @IsOneDefined(['all', 'page_size'])
  @IsOptional()
  all: string | boolean;

  @ApiPropertyOptional({
    required: false,
    enum: ['true', 'false', '1', '0'],
    description: `Filter by state 'isActive'. If you do not send it, return everything`,
  })
  @IsOptional()
  @IsValidStringNumber()
  isActive: string | boolean;

  @ApiPropertyOptional({
    required: false,
    enum: ['true', 'false', '1', '0'],
    description: `If you send it, return all registers with their relations`,
  })
  @IsValidStringNumber()
  @IsOptional()
  relations: string | boolean;
}
