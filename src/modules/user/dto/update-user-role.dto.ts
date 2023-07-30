import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UniqueItemArrayPipe } from 'src/common/validators/unique-item-array.decorator';

export class UpdateUserRoleDto {
  @ApiProperty({ isArray: true, type: () => Number })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @UniqueItemArrayPipe('roles', {
    message: 'roles contains duplicate elements',
  })
  roles: number[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
