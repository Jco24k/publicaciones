import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';

export class CreateRoleDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    maxLength: 40,
  })
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  @IsEnum(RolesValid)
  name: RolesValid;
}
