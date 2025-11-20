import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class CreatedBusinessDto {
  @ApiProperty({ description: 'UUID del usuario propietario del negocio' })
  @IsUUID()
  uuid_user: string;

  @ApiProperty({
    description: 'Código de registro único del negocio',
    example: 'REG-0001',
  })
  @IsString()
  registro_negocio: string;

  @ApiProperty({
    description: 'Nombre del negocio',
    example: 'Mercado La Esperanza',
  })
  @IsString()
  nombre_negocio: string;

  @ApiProperty({
    description: 'Ubicación del negocio',
    required: false,
    example: 'Tunja, Boyacá',
  })
  @IsOptional()
  @IsString()
  ubicacion?: string;

  @ApiProperty({ description: 'Descripción del negocio', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
