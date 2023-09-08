import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';

export class QueryPararmsRole extends PaginationQueryParams {
  @ApiPropertyOptional({ minimum: 1, type: 'integer' })
  @IsInt()
  @Min(1)
  @IsOptional()
  role_id?: number;
}
