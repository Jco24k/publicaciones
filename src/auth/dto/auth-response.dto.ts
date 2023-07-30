import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ type: 'string' })
  username: string;
  @ApiProperty()
  jwt: string;
}
