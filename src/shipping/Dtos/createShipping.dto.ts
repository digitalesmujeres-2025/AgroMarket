import { EstadoEnvio } from '../../entities/shipping.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreatedShippingDto {
  @ApiProperty({ description: 'UUID de la orden de compra asociada' })
  @IsUUID()
  uuid_orden_de_compra: string;

  @ApiProperty({
    description: 'Fecha de emisión en formato ISO 8601',
    required: false,
    example: '2025-01-15T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_emision?: string;

  @ApiProperty({
    description: 'Fecha de entrega en formato ISO 8601',
    required: false,
    example: '2025-01-20T16:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  fecha_entrega?: string;

  @ApiProperty({
    description: 'Estado del envío',
    required: false,
    enum: EstadoEnvio,
  })
  @IsOptional()
  @IsEnum(EstadoEnvio)
  estado_envio?: EstadoEnvio;
}
