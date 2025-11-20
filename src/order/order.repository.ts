import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from 'src/entities/user.entity';
import { UpdateOrderDto } from 'src/order/dto/updateOrder.dto';
import { OrderDetailRepository } from 'src/order_detail/order_detail.repository';
import { UpdateOrderDetailDto } from 'src/order_detail/dto/update-order-detail.dto';
import { OrderStatus } from 'src/enum/order_status.enum';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order) private readonly orderDataBase: Repository<Order>,
    @InjectRepository(User) private readonly userDataBase: Repository<User>,
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}

  async createOrder(CreateOrderDto: CreateOrderDto) {
    const user = await this.userDataBase.findOne({
      where: { uuid_user: CreateOrderDto.user_id },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const details: any[] = (CreateOrderDto as any).order_details;
    if (Array.isArray(details)) {
      const totalComputed = details.reduce(
        (acum, current) => acum + (current?.subtotal ?? 0),
        0,
      );
      if (CreateOrderDto.total !== totalComputed) {
        throw new Error('El total esta mal calculado');
      }
    }
    const newOrder = this.orderDataBase.create({
      ...CreateOrderDto,
      user: user,
    });
    return this.orderDataBase.save(newOrder);
  }

  async getAll() {
    return this.orderDataBase.find({ relations: ['order_details'] });
  }

  async getById(id: string) {
    const found = await this.orderDataBase.findOne({
      where: { uuid_order: id },
      relations: ['order_details'],
    });
    if (!found) throw new NotFoundException(`Order ${id} not found`);
    return found;
  }

  async update(orderExisting: Order, updateOrderDto: UpdateOrderDto) {
    const { order_details, ...orderFields } = updateOrderDto as any;
    orderExisting = { ...orderExisting, ...orderFields } as Order;
    if (Array.isArray(order_details)) {
      const totalComputed = order_details.reduce(
        (acum, current) => acum + (current?.subtotal ?? 0),
        0,
      );
      if (updateOrderDto.total !== totalComputed) {
        throw new Error('El total esta mal calculado');
      }
    }
    await this.orderDataBase.save(orderExisting);

    if (Array.isArray(order_details)) {
      const existingDetails = orderExisting.order_details ?? [];
      const incomingIds = new Set<string>();

      for (const item of order_details) {
        if (item.uuid_order_detail) {
          incomingIds.add(item.uuid_order_detail);
          const { uuid_order_detail, ...detailUpdate } = item;
          await this.orderDetailRepository.update(
            uuid_order_detail,
            detailUpdate as UpdateOrderDetailDto,
          );
        } else {
          if (!item.uuid_product) {
            throw new Error(
              'uuid_product is required when creating order detail',
            );
          }
          await this.orderDetailRepository.create({
            ...item,
            uuid_order: orderExisting.uuid_order,
          });
        }
      }

      for (const existing of existingDetails) {
        if (!incomingIds.has(existing.uuid_order_detail)) {
          await this.orderDetailRepository.remove(existing.uuid_order_detail);
        }
      }
    }

    console.log(`Se actualizó la orden: ${orderExisting.uuid_order}`);
    return {
      message: `Orden actualizada en la base de datos: ${orderExisting.uuid_order}`,
    };
  }

  async delete(orderExisting: Order) {
    orderExisting.order_status = OrderStatus.DISABLED;
    const res = await this.orderDataBase.save(orderExisting);
    if (!res)
      throw new NotFoundException(
        `Order ${orderExisting.uuid_order} no se pudo desactivar`,
      );
  }
}
