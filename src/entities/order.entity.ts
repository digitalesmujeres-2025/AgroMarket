import { OrderStatus } from 'src/enum/order_status.enum';
import { PayMethod } from 'src/enum/pay_method.enum';
import { PayStatus } from 'src/enum/pay_status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetail } from './order_detail.entity';
import { Shipping } from './shipping.entity';
import { User } from './user.entity';
// import { User } from './users.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid_order: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'uuid_user' })
  user: User;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  total: number;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  shipping_price: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  order_status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PayMethod,
  })
  pay_method: PayMethod;

  @Column({
    type: 'enum',
    enum: PayStatus,
    default: PayStatus.PENDING,
  })
  pay_status: PayStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date_created: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  date_updated: Date | null;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.uuid_order)
  order_details: OrderDetail[];

  @OneToMany(() => Shipping, (shipping) => shipping.order)
  shippings: Shipping[];
}
