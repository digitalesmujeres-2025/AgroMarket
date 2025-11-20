import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './createUser.dto';
import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class loggingUserDto extends PickType(CreateUserDto, [
  'user_name',
  'password',
] as const) {
  @ApiProperty({ description: 'Nombre de usuario' })
  @IsNotEmpty({ message: 'El usuario es requerido' })
  @IsString({ message: 'Credenciales invalidas' })
  user_name: string;
  @ApiProperty({ description: 'Contraseña' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'Credenciales invalidas' })
  password: string;
}
