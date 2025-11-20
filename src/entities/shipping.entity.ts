import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum EstadoEnvio {
  PENDIENTE = 'pendiente',
  EN_CAMINO = 'en_camino',
  ENTREGADO = 'entregado',
}

@Entity({ name: 'shipping' })
export class Shipping {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Order, (order) => order.shippings)
  @JoinColumn({ name: 'uuid_orden_de_compra' })
  order: Order;

  @Column({ type: 'timestamp', nullable: true })
  fecha_emision: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_entrega: Date;

  @Column({ type: 'enum', enum: EstadoEnvio, default: EstadoEnvio.PENDIENTE })
  estado_envio: EstadoEnvio;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  fecha_actualizacion: Date;
}
