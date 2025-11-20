import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './products.entity';
import { User } from './user.entity';

@Entity({ name: 'business' })
export class Business {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uuid_usuario' })
  user: User;

  @Column({ type: 'varchar', length: 100, unique: true })
  registro_negocio: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  nombre_negocio: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ubicacion?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion?: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  fecha_actualizacion: Date;

  @OneToMany(() => Product, (product) => product.business)
  products: Product[];
}
