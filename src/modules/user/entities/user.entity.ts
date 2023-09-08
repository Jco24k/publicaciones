import { ApiProperty } from '@nestjs/swagger';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[];

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

  @OneToOne(() => Employee, (employee) => employee.user, {
    nullable: false,
    cascade: true
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
