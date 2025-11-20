import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDetailRepository } from './order_detail.repository';
import { OrderDetail } from 'src/entities/order_detail.entity';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { OrderRepository } from 'src/order/order.repository';

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  create(dto: CreateOrderDetailDto) {
    return this.orderDetailRepository.create(dto);
  }

  getAll() {
    return this.orderDetailRepository.findAll();
  }

  async getById(id: string) {
    const orderDetailExisting = await this.orderDetailRepository.findById(id);
    if (!orderDetailExisting) {
      throw new NotFoundException('Este detalle de orden no existe');
    }
    return orderDetailExisting;
  }

  getByOrderId(OrderId: string) {
    return this.orderRepository.getById(OrderId);
  }

  remove(id: string) {
    return this.orderDetailRepository.remove(id);
  }

  findAll() {
    return this.getAll();
  }

  findOne(id: string) {
    return this.getById(id);
  }

  update(id: string, data: Partial<OrderDetail>) {
    return this.orderDetailRepository.update(id, data);
  }
}
