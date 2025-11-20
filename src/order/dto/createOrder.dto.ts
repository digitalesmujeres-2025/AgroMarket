import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/enum/order_status.enum';
import { PayMethod } from 'src/enum/pay_method.enum';
import { PayStatus } from 'src/enum/pay_status.enum';

export class CreateOrderDto {
  @ApiProperty({ description: 'UUID del usuario que realiza la orden' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Total de la orden', minimum: 0 })
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiProperty({ description: 'Costo de envío de la orden' })
  @IsNumber()
  shipping_price: number;

  @ApiProperty({ description: 'Método de pago', enum: PayMethod })
  @IsEnum(PayMethod)
  pay_method: PayMethod;

  @ApiPropertyOptional({ description: 'Estado de la orden', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  order_status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Estado del pago', enum: PayStatus })
  @IsOptional()
  @IsEnum(PayStatus)
  pay_status?: PayStatus;
}
