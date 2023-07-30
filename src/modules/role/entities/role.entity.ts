import { ApiProperty } from '@nestjs/swagger';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { User } from 'src/modules/user/entities/User.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
