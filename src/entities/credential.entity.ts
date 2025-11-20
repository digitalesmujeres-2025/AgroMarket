import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'credential' })
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  uuid_credential: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  user_name: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'timestamp' })
  last_access_date: Date;

  @Column({ type: 'timestamp' })
  creation_date: Date;

  @Column({ type: 'timestamp' })
  update_date: Date;

  @OneToOne(() => User, (user) => user.credential)
  @JoinColumn({ name: 'uuid_user' })
  user: User;
}
