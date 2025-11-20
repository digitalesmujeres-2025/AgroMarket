import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BusinessRepository } from './repository';
import { CreatedBusinessDto } from './Dtos/createBusiness.dto';
import { UpdateBusinessDto } from './Dtos/updateBusiness.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  getAllBusinessService() {
    return this.businessRepository.getAllBusinessRepository();
  }

  async getBusinessByIdService(uuid: string) {
    const businessExisting =
      await this.businessRepository.getBusinessByIdRepository(uuid);
    if (!businessExisting) {
      throw new NotFoundException('Este negocio no existe');
    }
    return businessExisting;
  }

  async getBusinessByNameService(name: string) {
    const businessExisting =
      await this.businessRepository.getBusinessByNameRepository(name);
    if (!businessExisting || businessExisting.length === 0) {
      throw new NotFoundException('No existe ningun negocio con este nombre');
    }
    return businessExisting;
  }

  async getBusinessProfileService(uuid: string) {
    const businessExisting =
      await this.businessRepository.getBusinessByIdRepository(uuid);
    if (!businessExisting) {
      throw new NotFoundException('Este negocio no existe');
    }
    if (businessExisting.estado === false) {
      throw new ConflictException('Este negocio no esta activo');
    }
    return this.businessRepository.getBusinessProfileRepository(
      businessExisting,
    );
  }

  async postCreateBusinessService(createBusinessDto: CreatedBusinessDto) {
    if (!createBusinessDto.uuid_user) {
      throw new BadRequestException('uuid_user es requerido');
    }
    if (!createBusinessDto.registro_negocio) {
      throw new BadRequestException('registro_negocio es requerido');
    }
    if (!createBusinessDto.nombre_negocio) {
      throw new BadRequestException('nombre_negocio es requerido');
    }
    if (createBusinessDto.registro_negocio) {
      const registerExisting =
        await this.businessRepository.getBusinessByRegister(
          createBusinessDto.registro_negocio,
        );
      if (registerExisting) {
        throw new ConflictException(
          'Este registro de negocio ya se encuentra en uso',
        );
      }
    }

    if (createBusinessDto.nombre_negocio) {
      const nameExisting = await this.businessRepository.getBusinessByName(
        createBusinessDto.nombre_negocio,
      );
      if (nameExisting) {
        throw new ConflictException(
          'Este nombre de negocio ya se encuentra registrado',
        );
      }
    }

    if (createBusinessDto.uuid_user) {
      const userBusinessExisting =
        await this.businessRepository.getBusinessByUserUuid(
          createBusinessDto.uuid_user,
        );
      if (userBusinessExisting) {
        throw new ConflictException(
          'El usuario ya tiene un negocio registrado',
        );
      }
    }

    return this.businessRepository.createBusinessRepository(createBusinessDto);
  }

  async putUpdateBusinessService(
    uuid: string,
    updateBusinessDto: UpdateBusinessDto,
  ) {
    const businessExisting =
      await this.businessRepository.getBusinessByIdRepository(uuid);
    if (!businessExisting) {
      throw new NotFoundException('No existe el negocio');
    }
    if (businessExisting.estado === false) {
      throw new ConflictException('Este negocio no esta activo');
    }

    if (updateBusinessDto.registro_negocio) {
      const registerExisting =
        await this.businessRepository.getBusinessByRegister(
          updateBusinessDto.registro_negocio,
        );
      if (registerExisting && registerExisting.uuid !== businessExisting.uuid) {
        throw new ConflictException(
          'Este registro de negocio ya se encuentra en uso',
        );
      }
    }

    if (updateBusinessDto.nombre_negocio) {
      const nameExisting = await this.businessRepository.getBusinessByName(
        updateBusinessDto.nombre_negocio,
      );
      if (nameExisting && nameExisting.uuid !== businessExisting.uuid) {
        throw new ConflictException(
          'Este nombre de negocio ya se encuentra registrado',
        );
      }
    }

    return this.businessRepository.putUpdateBusinessRepository(
      businessExisting,
      updateBusinessDto,
    );
  }

  async deleteBusinessService(uuid: string) {
    const businessExisting =
      await this.businessRepository.getBusinessByIdRepository(uuid);
    if (!businessExisting) {
      throw new NotFoundException('No existe el negocio');
    }
    if (businessExisting.estado === false) {
      throw new ConflictException('Este negocio ya no se encuentra activo');
    }
    return this.businessRepository.deleteBusinessRepository(businessExisting);
  }
}
