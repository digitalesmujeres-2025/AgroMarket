import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsBoolean } from 'class-validator';

export class UpdateBusinessDto {
  @ApiProperty({ description: 'UUID del usuario propietario', required: false })
  @IsOptional()
  @IsUUID()
  uuid_user?: string;

  @ApiProperty({
    description: 'Código de registro del negocio',
    required: false,
  })
  @IsOptional()
  @IsString()
  registro_negocio?: string;

  @ApiProperty({ description: 'Nombre del negocio', required: false })
  @IsOptional()
  @IsString()
  nombre_negocio?: string;

  @ApiProperty({ description: 'Ubicación del negocio', required: false })
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @ApiProperty({ description: 'Descripción del negocio', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Estado del negocio (activo/inactivo)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
