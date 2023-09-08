import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { UniqueItemArrayPipe } from 'src/common/validators/unique-item-array.decorator';
import { CreateEmployeeDto } from './create-user.dto';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
