import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential.entity';
import { Repository } from 'typeorm';
import { UpdateCredentialDto } from './Dtos/updateCredential.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CredentialRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

  async getAllCredentialsRepository() {
    return await this.credentialDataBase.find({
      relations: ['user'],
    });
  }

  async getCredentialByNameRepository(user_name: string) {
    return await this.credentialDataBase.findOne({
      where: { user_name },
      relations: ['user'],
    });
  }

  async getCredentialByIdRepository(uuid: string) {
    return await this.credentialDataBase.findOne({
      where: { uuid_credential: uuid },
      relations: ['user'],
    });
  }

  async findByUserName(user_name: string) {
    return await this.credentialDataBase.findOne({ where: { user_name } });
  }

  async updateCredentialRepository(
    credential: Credential,
    dto: UpdateCredentialDto,
  ) {
    if (dto.user_name) {
      credential.user_name = dto.user_name;
    }

    if (dto.password) {
      credential.password = await bcrypt.hash(dto.password, 10);
    }

    credential.update_date = new Date();

    await this.credentialDataBase.save(credential);
    return credential;
  }
}
