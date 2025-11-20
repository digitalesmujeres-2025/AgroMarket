import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { EstadoEnvio } from '../entities/shipping.entity';
import { CreatedShippingDto } from './Dtos/createShipping.dto';
import { UpdateShippingDto } from './Dtos/updateShipping.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';

@ApiTags('Envios')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @ApiOperation({ summary: 'Obtener envio por UUID' })
  @ApiResponse({ status: 200, description: 'Envio obtenido exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del envio' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getAllShipping/:uuid')
  getAllShipping(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.shippingService.getShippingByIdService(uuid);
  }

  @ApiOperation({ summary: 'Obtener un envio por su ID' })
  @ApiResponse({ status: 200, description: 'Envio obtenido exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del envio' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getShippingById/:uuid')
  getShippingById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.shippingService.getShippingByIdService(uuid);
  }

  @ApiOperation({ summary: 'Obtener envio por UUID de la orden' })
  @ApiResponse({ status: 200, description: 'Envio obtenido exitosamente.' })
  @ApiParam({ name: 'uuid_order', description: 'ID de la orden' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getShippingByOrder/:uuid_order')
  getShippingByOrder(@Param('uuid_order', ParseUUIDPipe) uuid_order: string) {
    return this.shippingService.getShippingByOrderUuidService(uuid_order);
  }

  @ApiOperation({ summary: 'Crear un envio' })
  @ApiResponse({ status: 201, description: 'Envio creado exitosamente.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Post('createShipping')
  postCreateShipping(@Body() createShippingDto: CreatedShippingDto) {
    return this.shippingService.postCreateShippingService(createShippingDto);
  }

  @ApiOperation({ summary: 'Actualizar un envio' })
  @ApiResponse({ status: 200, description: 'Envio actualizado exitosamente.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiParam({ name: 'uuid', description: 'ID del envio' })
  @Put('updateShipping/:uuid')
  putUpdateShipping(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingService.putUpdateShippingService(
      uuid,
      updateShippingDto,
    );
  }

  @ApiOperation({ summary: 'Eliminar un envio' })
  @ApiResponse({ status: 200, description: 'Envio eliminado exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del envio' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Delete('deleteShipping/:uuid')
  deleteShipping(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.shippingService.deleteShippingService(uuid);
  }
}
