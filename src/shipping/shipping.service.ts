import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShippingRepository } from './repository';
import { EstadoEnvio } from '../entities/shipping.entity';
import { CreatedShippingDto } from './Dtos/createShipping.dto';
import { UpdateShippingDto } from './Dtos/updateShipping.dto';

@Injectable()
export class ShippingService {
  constructor(private readonly shippingRepository: ShippingRepository) {}

  getAllShippingService() {
    return this.shippingRepository.getAllShippingRepository();
  }

  async getShippingByIdService(uuid: string) {
    const shippingExisting =
      await this.shippingRepository.getShippingByIdRepository(uuid);
    if (!shippingExisting) {
      throw new NotFoundException('Este envio no existe');
    }
    return shippingExisting;
  }

  async getShippingByEstadoService(estado: EstadoEnvio) {
    const shipments =
      await this.shippingRepository.getShippingByEstadoRepository(estado);
    if (!shipments || shipments.length === 0) {
      throw new NotFoundException('No existen envios con este estado');
    }
    return shipments;
  }

  async getShippingByOrderUuidService(orderUuid: string) {
    const shipping =
      await this.shippingRepository.getShippingByOrderUuid(orderUuid);
    if (!shipping) {
      throw new NotFoundException('No existe envio para esta orden');
    }
    return shipping;
  }

  async postCreateShippingService(createShippingDto: CreatedShippingDto) {
    if (!createShippingDto.uuid_orden_de_compra) {
      throw new BadRequestException('uuid_orden_de_compra es requerido');
    }
    const existingForOrder =
      await this.shippingRepository.getShippingByOrderUuid(
        createShippingDto.uuid_orden_de_compra,
      );
    if (existingForOrder) {
      throw new ConflictException('Ya existe un envio para esta orden');
    }
    return this.shippingRepository.createShippingRepository(createShippingDto);
  }

  async putUpdateShippingService(
    uuid: string,
    updateShippingDto: UpdateShippingDto,
  ) {
    const shippingExisting =
      await this.shippingRepository.getShippingByIdRepository(uuid);
    if (!shippingExisting) {
      throw new NotFoundException('No existe el envio');
    }
    if (shippingExisting.estado_envio === EstadoEnvio.ENTREGADO) {
      throw new ConflictException('Este envio ya fue entregado');
    }
    return this.shippingRepository.putUpdateShippingRepository(
      shippingExisting,
      updateShippingDto,
    );
  }

  async deleteShippingService(uuid: string) {
    const shippingExisting =
      await this.shippingRepository.getShippingByIdRepository(uuid);
    if (!shippingExisting) {
      throw new NotFoundException('No existe el envio');
    }
    if (shippingExisting.estado_envio === EstadoEnvio.ENTREGADO) {
      throw new ConflictException('Este envio ya fue entregado');
    }
    return this.shippingRepository.deleteShippingRepository(shippingExisting);
  }
}
