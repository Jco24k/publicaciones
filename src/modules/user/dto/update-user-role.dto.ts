import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueItemArrayPipe } from 'src/common/validators/unique-item-array.decorator';

export class UpdateUserRoleDto {
  @ApiProperty({
    minimum: 1,
    type: 'integer',
    title: 'USUARIO',
  })
  @Min(1)
  @IsInt()
  userId: number;

  @ApiProperty({ isArray: true, type: () => Number })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @IsArray()
  @ArrayNotEmpty()
  @UniqueItemArrayPipe('roles', {
    message: 'roles contains duplicate elements',
  })
  roles: number[];
}
