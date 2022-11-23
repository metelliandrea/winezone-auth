import { Transform, Type } from 'class-transformer';
import { Roles } from 'src/decorators/role.decorator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ database: 'auth' })
@Unique('UQ_USER_ID', ['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  guid: string;

  @Column({ type: 'varchar', length: 100 })
  email!: string;

  @Column({ type: 'varchar', length: 50 })
  firstname: string;

  @Column({ type: 'varchar', length: 50 })
  lastname: string;

  @Column({ type: 'varchar', length: 250 })
  password: string;

  @Column({ type: 'enum', enum: Roles })
  role: string;

  @Type(() => Boolean)
  @Column({ type: 'tinyint', default: 0 })
  isPremiumUser: boolean;

  @Transform(({ value }) => new Date(value).toLocaleString('us'))
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date; // CURRENT_TIMESTAMP

  @Transform(({ value }) => new Date(value).toLocaleString('us'))
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date; // CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

  @Transform(({ value }) =>
    value ? new Date(value).toLocaleString('us') : null,
  )
  @DeleteDateColumn({ type: 'datetime', default: null })
  deletedAt!: Date;
}

export interface IUser {
  guid: string;
  email: string;
  firstname: string;
  lastname: string;
  // password: string;
  role: Roles;
  isPremiumUser: false;
}
