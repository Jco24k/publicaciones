import { ApiProperty } from '@nestjs/swagger';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'employees' })
export class Employee {
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
  last_name: string;

  @ApiProperty({
    maxLength: 8,
    type: 'string',
  })
  @Column('varchar', {
    nullable: false,
    length: 8,
    unique: true
  })
  dni: string;

  @ApiProperty({
    default: true,
  })
  @Column({
    name: 'is_active',
    default: true,
  })
  isActive: boolean;

  @OneToOne(() => User, (user) => user.employee)
  user: User;
}
