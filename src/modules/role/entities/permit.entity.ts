import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { ValidPermits } from 'src/common/permit/valid-permit';

@Entity({ name: 'permits' })
export class Permit {
  @ApiProperty({ uniqueItems: true })
  @PrimaryGeneratedColumn()
  id: number;


  @ApiProperty({ maxLength: 45, uniqueItems: true })
  @Column({
    nullable: false,
    name: 'code',
    type: 'varchar',
    length: 45,
    unique: true,
  })
  code: ValidPermits;

  @ApiProperty({
    maxLength: 40,
    type: 'string',
  })
  @Column('varchar', {
    nullable: false,
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
