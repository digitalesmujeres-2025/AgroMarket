import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order_detail.entity';
import { Repository, DeepPartial } from 'typeorm';
import { Product } from 'src/entities/products.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Injectable()
export class OrderDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailDataBase: Repository<OrderDetail>,
    @InjectRepository(Order) private readonly orderDataBase: Repository<Order>,
    @InjectRepository(Product)
    private readonly productDataBase: Repository<Product>,
  ) {}

  async create(
    detail: Partial<OrderDetail> | CreateOrderDetailDto,
  ): Promise<OrderDetail> {
    const payload: Partial<OrderDetail> = { ...detail };
    const d: any = detail as any;
    let order: Order | null = null;
    let product: Product | null = null;
    if (typeof d.uuid_order === 'string') {
      order = await this.orderDataBase.findOne({
        where: { uuid_order: d.uuid_order },
      });
    }
    if (typeof d.uuid_product === 'string') {
      product = await this.productDataBase.findOne({
        where: { uuid: d.uuid_product },
      });
      delete (payload as any).uuid_product;
    }
    if (!order || !product) {
      throw new NotFoundException('Orden o Producto no encontrado');
    }
    const { cant, iva_applied, discount } = d;
    const totalProductsPrice = (product.basePrice ?? 0) * (cant ?? 0);
    const totalIva = totalProductsPrice * ((iva_applied ?? 0) / 100);
    const totalDiscount = totalProductsPrice * ((discount ?? 0) / 100);
    const total = totalProductsPrice + totalIva - totalDiscount;
    if (typeof d.subtotal !== 'undefined' && d.subtotal !== total) {
      throw new Error(
        'Los subtotales no coinciden, hay un error en el calculo',
      );
    }
    (payload as any).uuid_order = order;
    (payload as any).product = product;
    (payload as any).subtotal = total;
    const entity = this.orderDetailDataBase.create(
      payload as DeepPartial<OrderDetail>,
    );
    return await this.orderDetailDataBase.save(entity);
  }

  async findAll(): Promise<OrderDetail[]> {
    return this.orderDetailDataBase.find({
      relations: ['uuid_order', 'product'],
    });
  }

  async findById(id: string): Promise<OrderDetail> {
    const found = await this.orderDetailDataBase.findOne({
      where: { uuid_order_detail: id },
      relations: ['uuid_order', 'product'],
    });
    if (!found) throw new NotFoundException(`OrderDetail ${id} not found`);
    return found;
  }

  async update(
    id: string,
    data: Partial<OrderDetail> | UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    const payload: Partial<OrderDetail> = { ...data };
    const d: any = data as any;
    if (typeof d.uuid_product === 'string' || (d.product && d.product.uuid)) {
      const productUuid =
        typeof d.uuid_product === 'string' ? d.uuid_product : d.product.uuid;
      const product = await this.productDataBase.findOne({
        where: { uuid: productUuid },
      });
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
      const { cant, iva_applied, discount } = d;
      const totalProductsPrice = (product.basePrice ?? 0) * (cant ?? 1);
      const totalIva = totalProductsPrice * ((iva_applied ?? 0) / 100);
      const totalDiscount = totalProductsPrice * ((discount ?? 0) / 100);
      const total = totalProductsPrice + totalIva - totalDiscount;
      if (typeof d.subtotal !== 'undefined' && d.subtotal !== total) {
        throw new Error(
          'Los subtotales no coinciden, hay un error en el cálculo',
        );
      }
      (payload as any).product = product;
      (payload as any).subtotal = total;
      delete (payload as any).uuid_product;
    }
    if (typeof d.uuid_order === 'string' || (d.order && d.order.uuid_order)) {
      const orderUuid =
        typeof d.uuid_order === 'string' ? d.uuid_order : d.order.uuid_order;
      const order = await this.orderDataBase.findOne({
        where: { uuid_order: orderUuid },
      });
      if (!order) {
        throw new NotFoundException('Orden no encontrada');
      }
      (payload as any).uuid_order = order;
    }
    await this.orderDetailDataBase.update(
      { uuid_order_detail: id },
      payload as QueryDeepPartialEntity<OrderDetail>,
    );
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const res = await this.orderDetailDataBase.delete({
      uuid_order_detail: id,
    });
    if (res.affected === 0)
      throw new NotFoundException(`OrderDetail ${id} not found`);
  }
}
