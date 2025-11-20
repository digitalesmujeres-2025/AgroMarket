import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCredentialDto {
  @ApiPropertyOptional({ description: 'Nuevo nombre de usuario' })
  @IsOptional()
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  user_name?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña' })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password?: string;

  @ApiProperty({ description: 'UUID de la credencial a actualizar' })
  @IsNotEmpty({ message: 'El UUID de la credencial es obligatorio' })
  @IsUUID('4', { message: 'Debe ser un UUID válido' })
  uuid: string;
}
