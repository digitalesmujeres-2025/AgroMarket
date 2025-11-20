import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  createOrderService(CreateOrderDto: CreateOrderDto) {
    return this.orderRepository.createOrder(CreateOrderDto);
  }

  getAll() {
    return this.orderRepository.getAll();
  }

  getById(id: string) {
    return this.orderRepository.getById(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const orderExisting = await this.orderRepository.getById(id);
    if (!orderExisting) {
      if (!orderExisting) {
        throw new Error('Orden no encontrada');
      }
    }
    return this.orderRepository.update(orderExisting, updateOrderDto);
  }

  async delete(id: string) {
    const orderExisting = await this.orderRepository.getById(id);
    if (!orderExisting) {
      throw new Error('Orden no encontrada');
    }
    return this.orderRepository.delete(orderExisting);
  }
}
