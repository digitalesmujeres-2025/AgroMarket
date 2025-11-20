import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Detalles de Orden')
@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @ApiOperation({ summary: 'Crear detalle de orden' })
  @ApiResponse({ status: 201, description: 'Detalle creado' })
  @Post()
  create(@Body() CreateOrderDetailDto: CreateOrderDetailDto) {
    return this.orderDetailService.create(CreateOrderDetailDto);
  }

  @ApiOperation({ summary: 'Listar detalles de orden' })
  @ApiResponse({ status: 200, description: 'Listado obtenido' })
  @Get()
  getAll() {
    return this.orderDetailService.getAll();
  }

  @ApiOperation({ summary: 'Obtener detalle por UUID' })
  @ApiResponse({ status: 200, description: 'Detalle encontrado' })
  @ApiResponse({ status: 404, description: 'Detalle no encontrado' })
  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailService.getById(id);
  }

  @ApiOperation({ summary: 'Actualizar detalle de orden' })
  @ApiResponse({ status: 200, description: 'Detalle actualizado' })
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.update(id, body as any);
  }

  @ApiOperation({ summary: 'Eliminar detalle de orden' })
  @ApiResponse({ status: 200, description: 'Detalle eliminado' })
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderDetailService.remove(id);
  }
}
