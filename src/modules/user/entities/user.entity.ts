import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
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
  username: string;

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
  email: string;

  @ApiProperty({
    maxLength: 60,
    type: 'string',
  })
  @Column('varchar', {
    nullable: false,
    length: 60,
    select: false,
  })
  password: string;

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

  @ManyToMany(() => Role, (roles) => roles.users)
  @JoinTable()
  roles: Role[];
  //   @JoinTable({
  //     name: 'users_roles',
  //     joinColumn: {
  //       name: 'user_id',
  //       referencedColumnName: 'id',
  //     },
  //     inverseJoinColumn: {
  //       name: 'role_id',
  //       referencedColumnName: 'id',
  //     },
  //   })
}
