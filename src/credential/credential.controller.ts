import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CredentialService } from './credential.service';
import { UpdateCredentialDto } from './Dtos/updateCredential.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';

@ApiTags('Credenciales')
@Controller('credential')
export class CredentialController {
  constructor(private readonly credentialService: CredentialService) {}

  @ApiOperation({ summary: 'Listar credenciales' })
  @ApiResponse({ status: 200, description: 'Listado obtenido' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getCredentials')
  getAllCredentials() {
    return this.credentialService.getAllCredentialsService();
  }

  @ApiOperation({ summary: 'Buscar credencial por usuario' })
  @ApiResponse({ status: 200, description: 'Credencial encontrada' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getCredentialByName')
  getCredentialByName(@Query('user_name') user_name: string) {
    return this.credentialService.getCredentialByNameService(user_name);
  }

  @ApiOperation({ summary: 'Obtener credencial por UUID' })
  @ApiResponse({ status: 200, description: 'Credencial encontrada' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  @ApiParam({ name: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getCredentialById/:uuid')
  getCredentialById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.credentialService.getCredentialByIdService(uuid);
  }

  @ApiOperation({ summary: 'Actualizar credencial' })
  @ApiResponse({ status: 200, description: 'Credencial actualizada' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.CUSTOMER)
  @Patch('updateCredential')
  updateCredential(@Body() dto: UpdateCredentialDto) {
    return this.credentialService.updateCredentialService(dto);
  }
}
