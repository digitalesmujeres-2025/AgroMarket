import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Category } from './categories.entity';
import { Business } from './business.entity';
import { OrderDetail } from './order_detail.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'int',
    unique: true,
    nullable: false,
  })
  productCode: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  basePrice: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 0,
  })
  iva: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageUrl: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderProducts: OrderDetail[];

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'uuid_categoria' })
  category: Category;

  @ManyToOne(() => Business, (business) => business.products)
  @JoinColumn({ name: 'uuid_negocio' })
  business: Business;
}
