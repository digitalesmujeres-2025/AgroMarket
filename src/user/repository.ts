import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Credential } from 'src/entities/credential.entity';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

  async getAllUsersRepository() {
    return await this.userDataBase.find({ relations: ['credential'] });
  }

  async getUserByNameRepository(name: string) {
    return await this.userDataBase.find({
      where: { name },
      //relations: ['credential'],
    });
  }

  async getUserByIdRepository(uuid: string) {
    return await this.userDataBase.findOne({
      where: { uuid_user: uuid },
      relations: ['credential'],
    });
  }

  async findCredentialByUserName(user_name: string) {
    return await this.credentialDataBase.findOne({ where: { user_name } });
  }

  async findUserByEmail(email: string) {
    return await this.userDataBase.findOne({ where: { email } });
  }

  //Crear un usuario

  async createUserRepository(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newCredential = this.credentialDataBase.create({
      user_name: dto.user_name,
      password: hashedPassword,
      creation_date: new Date(),
      update_date: new Date(),
      last_access_date: new Date(),
    });

    await this.credentialDataBase.save(newCredential);

    const newUser = this.userDataBase.create({
      cedula: dto.cedula,
      name: dto.name,
      last_name: dto.last_name,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      role: 'customer',
      status: true,
      creation_date: new Date(),
      update_date: new Date(),
      credential: newCredential,
    });

    await this.userDataBase.save(newUser);
    console.log(`Perfil creado: ${newUser.uuid_user}`);
    return 'Usuario creado con éxito';
  }

  // Actualizar perfil existente

  async updateUserRepository(existingUser: User, dto: UpdateUserDto) {
    if (dto.name) {
      existingUser.name = dto.name;
    }
    if (dto.last_name) {
      existingUser.last_name = dto.last_name;
    }
    if (dto.address) {
      existingUser.address = dto.address;
    }
    if (dto.email) {
      existingUser.email = dto.email;
    }
    /* credential updates
    if (dto.user_name) {
      existingUser.credential.user_name = dto.user_name;
    }

    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      existingUser.credential.password = hashed;
    }*/

    existingUser.update_date = new Date();
    existingUser.credential.update_date = new Date();

    await this.userDataBase.save(existingUser);
    //await this.credentialDataBase.save(existingUser.credential);

    return { message: 'Usuario actualizado exitosamente' };
  }

  // Eliminar Usuario
  async deleteUserRepository(user: User) {
    await this.credentialDataBase.remove(user.credential);
    await this.userDataBase.remove(user);
    return { message: 'Usuario eliminado correctamente' };
  }
}
