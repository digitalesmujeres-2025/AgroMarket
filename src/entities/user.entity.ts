import { Roles } from 'src/enum/roles.enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Credential } from './credential.entity';
import { Order } from './order.entity';
import { Business } from './business.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid_user: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cedula: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  address: string;

  @Column({ type: 'varchar', length: 50, enum: Roles })
  role: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'timestamp' })
  creation_date: Date;

  @Column({ type: 'timestamp' })
  update_date: Date;

  @OneToOne(() => Credential, (credential) => credential.user)
  credential: Credential;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Business, (business) => business.user)
  businesses: Business[];
}
