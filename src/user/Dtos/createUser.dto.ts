import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Cédula del usuario' })
  @IsNotEmpty({ message: 'La cedula es requerida' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  cedula: string;

  @ApiProperty({ description: 'Nombre del usuario' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  name: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  last_name: string;

  @ApiProperty({ description: 'Teléfono del usuario' })
  @IsNotEmpty({ message: 'El telefono es requerido' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  phone: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'Debe ser un correo valido' })
  email: string;

  @ApiProperty({ description: 'Dirección del usuario' })
  @IsNotEmpty({ message: 'La direccion es requerida' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  address: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  user_name: string;

  @ApiProperty({ description: 'Contraseña de acceso' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'Debe ser una cadena de caracteres' })
  password: string;
}
