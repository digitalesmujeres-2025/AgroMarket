import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Órdenes')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Crear orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creada' })
  @Post()
  createOrder(@Body() CreateOrderDto: CreateOrderDto) {
    return this.orderService.createOrderService(CreateOrderDto);
  }

  @ApiOperation({ summary: 'Listar órdenes' })
  @ApiResponse({ status: 200, description: 'Listado de órdenes' })
  @Get()
  getAll() {
    return this.orderService.getAll();
  }

  @ApiOperation({ summary: 'Obtener orden por UUID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.getById(id);
  }

  @ApiOperation({ summary: 'Actualizar orden' })
  @ApiResponse({ status: 200, description: 'Orden actualizada' })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() UpdateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, UpdateOrderDto);
  }

  @ApiOperation({ summary: 'Desactivar orden' })
  @ApiResponse({ status: 200, description: 'Orden desactivada' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.delete(id);
  }
}
