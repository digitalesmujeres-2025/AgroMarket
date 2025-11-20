import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCredentialDto } from './Dtos/updateCredential.dto';
import { CredentialRepository } from './repository';

@Injectable()
export class CredentialService {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  getAllCredentialsService() {
    return this.credentialRepository.getAllCredentialsRepository();
  }

  getCredentialByNameService(user_name: string) {
    return this.credentialRepository.getCredentialByNameRepository(user_name);
  }

  getCredentialByIdService(uuid: string) {
    return this.credentialRepository.getCredentialByIdRepository(uuid);
  }

  async updateCredentialService(dto: UpdateCredentialDto) {
    const credential =
      await this.credentialRepository.getCredentialByIdRepository(dto.uuid);

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada');
    }

    if (dto.user_name) {
      const existing = await this.credentialRepository.findByUserName(
        dto.user_name,
      );
      if (existing) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }
    }

    return await this.credentialRepository.updateCredentialRepository(
      credential,
      dto,
    );
  }
}
