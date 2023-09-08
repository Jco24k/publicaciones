import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permits' })
export class Permit {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    maxLength: 40,
    uniqueItems: true,
    type: 'string',
  })
  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 40,
  })
  name: string;

  @ApiProperty({
    maxLength: 40,
    type: 'string',
  })
  @Column('varchar', {
    nullable: false,
    length: 40,
  })
  description: string;

  @ManyToMany(() => Role, (role) => role.permits)
  roles: Role[]
}
