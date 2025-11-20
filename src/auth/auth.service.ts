import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialRepository } from 'src/credential/repository';
import { loggingUserDto } from 'src/user/Dtos/loggingUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly jwtService: JwtService,
  ) {}

  async loggingUserService(dto: loggingUserDto) {
    const user = await this.credentialRepository.getCredentialByNameRepository(
      dto.user_name,
    );
    if (!user) {
      throw new NotFoundException('Credenciales inválidas');
    }
    const validatepassword = await bcrypt.compare(dto.password, user.password);
    if (!validatepassword) {
      throw new NotFoundException('Credenciales inválidas');
    }

    if (user.user.status === false) {
      throw new ConflictException(
        'El usuario esta inactivo, comuniquese con el administrador',
      );
    }
    const payload = {
      id: user.user.uuid_user,
      role: user.user.role,
      user_name: user.user_name,
    };
    const token = this.jwtService.sign(payload);

    return { message: 'Inicio de sesion exitoso', token };
  }
}
