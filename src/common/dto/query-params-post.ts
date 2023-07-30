import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryParams } from './pagination-query-params.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryPararmsPost extends PaginationQueryParams {
  @ApiPropertyOptional({ minimum: 1, type: 'integer' })
  @IsInt()
  @Min(1)
  @IsOptional()
  user_id?: number;
}
