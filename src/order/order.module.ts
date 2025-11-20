import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { OrderController } from './order.controller';
import { User } from 'src/entities/user.entity';
import { OrderDetailModule } from 'src/order_detail/order_detail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User]), OrderDetailModule],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderRepository],
})
export class OrderModule {}
