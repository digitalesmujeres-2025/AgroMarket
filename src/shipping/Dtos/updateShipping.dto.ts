import { EstadoEnvio } from '../../entities/shipping.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString, IsEnum } from 'class-validator';

export class UpdateShippingDto {
  @ApiProperty({ description: 'UUID de la orden de compra', required: false })
  @IsOptional()
  @IsUUID()
  uuid_orden_de_compra?: string;

  @ApiProperty({ description: 'Fecha de emisión ISO 8601', required: false })
  @IsOptional()
  @IsDateString()
  fecha_emision?: string;

  @ApiProperty({ description: 'Fecha de entrega ISO 8601', required: false })
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
