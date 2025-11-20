import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from 'src/entities/business.entity';

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectRepository(Business)
    private readonly businessDataBase: Repository<Business>,
  ) {}

  async getAllBusinessRepository() {
    const businesses = await this.businessDataBase.find();
    return businesses;
  }

  async getBusinessByIdRepository(uuid: string) {
    return await this.businessDataBase.findOne({ where: { uuid } });
  }

  getBusinessProfileRepository(businessExisting: Business) {
    return businessExisting;
  }

  async getBusinessByNameRepository(name: string) {
    return await this.businessDataBase.find({
      where: { nombre_negocio: name },
    });
  }

  async getBusinessByRegister(registro_negocio: string) {
    return await this.businessDataBase.findOne({
      where: { registro_negocio },
    });
  }

  async getBusinessByName(nombre_negocio: string) {
    return await this.businessDataBase.findOne({
      where: { nombre_negocio },
    });
  }

  async getBusinessByUserUuid(uuid_usuario: string) {
    return await this.businessDataBase.findOne({
      where: { user: { uuid_user: uuid_usuario } },
      relations: ['user'],
    });
  }

  async createBusinessRepository(createBusinessDto: any) {
    const newBusiness = this.businessDataBase.create({
      user: { uuid_user: createBusinessDto.uuid_user } as any,
      registro_negocio: createBusinessDto.registro_negocio,
      nombre_negocio: createBusinessDto.nombre_negocio,
      ubicacion: createBusinessDto.ubicacion,
      descripcion: createBusinessDto.descripcion,
      estado: true,
      fecha_creacion: new Date(),
    });
    await this.businessDataBase.save(newBusiness);
    return {
      message: `Negocio creado con nombre ${newBusiness.nombre_negocio}`,
    };
  }

  async putUpdateBusinessRepository(
    businessExisting: Business,
    updateBusinessDto: any,
  ) {
    if (updateBusinessDto.uuid_user) {
      businessExisting.user = {
        uuid_user: updateBusinessDto.uuid_user,
      } as any;
    }
    if (updateBusinessDto.registro_negocio) {
      businessExisting.registro_negocio = updateBusinessDto.registro_negocio;
    }
    if (updateBusinessDto.nombre_negocio) {
      businessExisting.nombre_negocio = updateBusinessDto.nombre_negocio;
    }
    if (updateBusinessDto.ubicacion) {
      businessExisting.ubicacion = updateBusinessDto.ubicacion;
    }
    if (updateBusinessDto.descripcion) {
      businessExisting.descripcion = updateBusinessDto.descripcion;
    }
    if (typeof updateBusinessDto.estado === 'boolean') {
      businessExisting.estado = updateBusinessDto.estado;
    }
    businessExisting.fecha_actualizacion = new Date();

    await this.businessDataBase.save(businessExisting);
    return { message: 'Negocio actualizado exitosamente' };
  }

  async deleteBusinessRepository(businessExisting: Business) {
    businessExisting.estado = false;
    businessExisting.fecha_actualizacion = new Date();
    await this.businessDataBase.save(businessExisting);
    return {
      message: `El negocio ${businessExisting.nombre_negocio} se desactivo`,
    };
  }

  async findBusinessByUuid(businessUuid: string) {
    return await this.businessDataBase.findOne({
      where: { uuid: businessUuid },
    });
  }
}
