import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipping, EstadoEnvio } from '../entities/shipping.entity';
import { CreatedShippingDto } from './Dtos/createShipping.dto';
import { UpdateShippingDto } from './Dtos/updateShipping.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class ShippingRepository {
  constructor(
    @InjectRepository(Shipping)
    private readonly shippingDataBase: Repository<Shipping>,
  ) {}

  async getAllShippingRepository() {
    return await this.shippingDataBase.find();
  }

  async getShippingByIdRepository(uuid: string) {
    return await this.shippingDataBase.findOne({ where: { uuid } });
  }

  async getShippingByEstadoRepository(estado: EstadoEnvio) {
    return await this.shippingDataBase.find({
      where: { estado_envio: estado },
    });
  }

  async getShippingByOrderUuid(orderUuid: string) {
    return await this.shippingDataBase.findOne({
      where: { order: { uuid_order: orderUuid } },
      relations: ['order'],
    });
  }

  async createShippingRepository(createShippingDto: CreatedShippingDto) {
    const orderRef = new Order();
    orderRef.uuid_order = createShippingDto.uuid_orden_de_compra;
    const newShipping = this.shippingDataBase.create({
      order: orderRef,
      fecha_emision: createShippingDto.fecha_emision
        ? new Date(createShippingDto.fecha_emision)
        : new Date(),
      fecha_entrega: createShippingDto.fecha_entrega
        ? new Date(createShippingDto.fecha_entrega)
        : undefined,
      estado_envio: createShippingDto.estado_envio ?? EstadoEnvio.PENDIENTE,
    });
    await this.shippingDataBase.save(newShipping);
    return {
      message: `Envio creado para la orden ${createShippingDto.uuid_orden_de_compra}`,
    };
  }

  async putUpdateShippingRepository(
    shippingExisting: Shipping,
    updateShippingDto: UpdateShippingDto,
  ) {
    if (updateShippingDto.uuid_orden_de_compra) {
      const orderRef = new Order();
      orderRef.uuid_order = updateShippingDto.uuid_orden_de_compra;
      shippingExisting.order = orderRef;
    }
    if (updateShippingDto.fecha_emision) {
      shippingExisting.fecha_emision = new Date(
        updateShippingDto.fecha_emision,
      );
    }
    if (updateShippingDto.fecha_entrega) {
      shippingExisting.fecha_entrega = new Date(
        updateShippingDto.fecha_entrega,
      );
    }
    if (updateShippingDto.estado_envio) {
      shippingExisting.estado_envio = updateShippingDto.estado_envio;
    }
    shippingExisting.fecha_actualizacion = new Date();
    await this.shippingDataBase.save(shippingExisting);
    return { message: 'Envio actualizado exitosamente' };
  }

  async deleteShippingRepository(shippingExisting: Shipping) {
    await this.shippingDataBase.remove(shippingExisting);
    return { message: `El envio ${shippingExisting.uuid} fue eliminado` };
  }
}
