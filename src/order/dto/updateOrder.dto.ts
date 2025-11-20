import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/enum/order_status.enum';
import { PayMethod } from 'src/enum/pay_method.enum';
import { PayStatus } from 'src/enum/pay_status.enum';

export class UpdateOrderDto {
  @ApiPropertyOptional({ description: 'Nuevo total de la orden', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  total?: number;

  @ApiPropertyOptional({ description: 'Nuevo costo de envío' })
  @IsOptional()
  @IsNumber()
  shipping_price?: number;

  @ApiPropertyOptional({ description: 'Método de pago', enum: PayMethod })
  @IsOptional()
  @IsEnum(PayMethod)
  pay_method?: PayMethod;

  @ApiPropertyOptional({ description: 'Estado de la orden', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  order_status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Estado del pago', enum: PayStatus })
  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus;
}
