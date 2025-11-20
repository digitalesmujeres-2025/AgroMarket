import {
  IsOptional,
  IsNumber,
  IsUUID,
  Min,
  IsPositive,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/products.entity';
import { Type } from 'class-transformer';

export class UpdateOrderDetailDto {
  @ApiPropertyOptional({ description: 'UUID de la orden asociada' })
  @IsOptional()
  @IsUUID()
  uuid_order?: string;

  @ApiPropertyOptional({ description: 'UUID del producto' })
  @IsOptional()
  @IsUUID()
  uuid_product?: string;

  @ApiPropertyOptional({ description: 'Cantidad', minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cant?: number;

  @ApiPropertyOptional({ description: 'IVA aplicado' })
  @IsOptional()
  @IsNumber()
  iva_applied?: number;

  @ApiPropertyOptional({ description: 'Descuento aplicado' })
  @IsOptional()
  @IsNumber()
  discount?: number;

  product?: Product;
  order?: Order;

  @ApiPropertyOptional({ description: 'Subtotal', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  subtotal?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailItemDto)
  order_details?: OrderDetailItemDto[];
}

export class OrderDetailItemDto extends UpdateOrderDetailDto {
  @IsOptional()
  @IsUUID()
  uuid_order_detail?: string;
}
