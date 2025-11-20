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
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreatedBusinessDto } from './Dtos/createBusiness.dto';
import { UpdateBusinessDto } from './Dtos/updateBusiness.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';

@ApiTags('Negocios')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({ summary: 'Obtener negocio por UUID' })
  @ApiResponse({ status: 200, description: 'Negocio obtenido exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del negocio' })
  @Get('getAllBusiness/:uuid')
  getAllBusiness(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.businessService.getBusinessByIdService(uuid);
  }

  @ApiOperation({ summary: 'Obtener un negocio por su ID' })
  @ApiResponse({ status: 200, description: 'Negocio obtenido exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del negocio' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getBusinessById/:uuid')
  getBusinessById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.businessService.getBusinessByIdService(uuid);
  }

  @ApiOperation({ summary: 'Obtener perfil de negocio' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del negocio' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile/:uuid')
  getBusinessProfile(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.businessService.getBusinessProfileService(uuid);
  }

  @ApiOperation({ summary: 'Crear un nuevo negocio' })
  @ApiResponse({ status: 201, description: 'Negocio creado exitosamente.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.PRODUCER)
  @Post('createBusiness')
  postCreateBusiness(@Body() createBusinessDto: CreatedBusinessDto) {
    return this.businessService.postCreateBusinessService(createBusinessDto);
  }

  @ApiOperation({ summary: 'Actualizar un negocio' })
  @ApiResponse({
    status: 200,
    description: 'Negocio actualizado exitosamente.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.PRODUCER)
  @ApiParam({ name: 'uuid', description: 'ID del negocio' })
  @Put('updateBusiness/:uuid')
  putUpdateBusiness(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessService.putUpdateBusinessService(
      uuid,
      updateBusinessDto,
    );
  }

  @ApiOperation({ summary: 'Eliminar (soft-delete) un negocio' })
  @ApiResponse({ status: 200, description: 'Negocio eliminado exitosamente.' })
  @ApiParam({ name: 'uuid', description: 'ID del negocio' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Delete('deleteBusiness/:uuid')
  deleteBusiness(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.businessService.deleteBusinessService(uuid);
  }
}
