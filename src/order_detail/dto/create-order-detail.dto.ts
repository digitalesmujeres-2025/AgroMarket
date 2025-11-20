import { IsNumber, IsOptional, IsPositive, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderDetailDto {
  @ApiProperty({ description: 'UUID de la orden asociada' })
  @IsUUID()
  uuid_order: string;

  @ApiProperty({ description: 'UUID del producto incluido' })
  @IsUUID()
  uuid_product: string;

  @ApiProperty({ description: 'Cantidad del producto', minimum: 1 })
  @IsNumber()
  @Min(1)
  cant: number;

  @ApiPropertyOptional({ description: 'IVA aplicado' })
  @IsOptional()
  @IsNumber()
  iva_applied?: number;

  @ApiPropertyOptional({ description: 'Descuento aplicado' })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ description: 'Subtotal del detalle', minimum: 0 })
  @IsNumber()
  @IsPositive()
  subtotal: number;
}
