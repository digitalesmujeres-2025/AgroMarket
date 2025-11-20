import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { UserRepository } from './repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Obtener todos
  getAllUsersService() {
    return this.userRepository.getAllUsersRepository();
  }

  // Buscar por nombre
  async getUserByNameService(name: string) {
    const users = await this.userRepository.getUserByNameRepository(name);

    if (!users.length) throw new NotFoundException('Usuario no encontrado');

    return users;
  }

  // Buscar por ID
  async getUserByIdService(uuid: string) {
    const user = await this.userRepository.getUserByIdRepository(uuid);

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return user;
  }

  // Crear usuario
  async createUserService(dto: CreateUserDto) {
    const existingUserName = await this.userRepository.findCredentialByUserName(
      dto.user_name,
    );

    const existingEmail = await this.userRepository.findUserByEmail(dto.email);

    if (existingUserName || existingEmail)
      throw new BadRequestException('El usuario o correo ya existen');

    return await this.userRepository.createUserRepository(dto);
  }

  // Actualizar usuario
  async updateUserService(dto: UpdateUserDto) {
    const userExisting = await this.userRepository.getUserByIdRepository(
      dto.uuid_user,
    );

    if (!userExisting) throw new NotFoundException('Usuario no encontrado');

    if (dto.email) {
      const emailExisting = await this.userRepository.findUserByEmail(
        dto.email,
      );
      if (emailExisting)
        throw new ConflictException('Este correo ya se encuentra registrado');
    }

    if (dto.user_name) {
      const userNameExisting =
        await this.userRepository.findCredentialByUserName(dto.user_name);
      if (userNameExisting) {
        throw new ConflictException('Este nombre de usuario ya está en uso');
      }
    }
    return await this.userRepository.updateUserRepository(userExisting, dto);
  }

  // Eliminar usuario
  async deleteUserService(uuid: string) {
    const user = await this.userRepository.getUserByIdRepository(uuid);

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return await this.userRepository.deleteUserRepository(user);
  }
}
