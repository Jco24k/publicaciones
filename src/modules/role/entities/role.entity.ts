import { ApiProperty } from '@nestjs/swagger';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permit } from './permit.entity';

@Entity({ name: 'roles' })
export class Role {
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
  name: RolesValid;

  @ApiProperty({
    default: true,
    nullable: false,
  })
  @Column({
    name: 'is_active',
    default: true,
    nullable: false,
  })
  isActive: boolean;

  @ManyToMany(() => User, (users) => users.roles)
  users: User[];

  @ManyToMany(() => Permit, (permit) => permit.roles, {
    nullable: true
  })
  @JoinTable()
  permits: Permit[];
}
