import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UpdateUserDto } from './Dtos/updateUser.dto';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Role } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/auth.guard';

@ApiTags('Usuarios')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Usuarios obtenidos' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getAllUsers')
  getAllUsers() {
    return this.userService.getAllUsersService();
  }

  @ApiOperation({ summary: 'Buscar usuario por nombre' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getUserByName')
  getUserByName(@Query('name') name: string) {
    return this.userService.getUserByNameService(name);
  }

  @ApiOperation({ summary: 'Obtener usuario por UUID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiParam({ name: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get('getUserById/:uuid')
  getUserById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.getUserByIdService(uuid);
  }

  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @Post('createUser')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUserService(dto);
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.CUSTOMER)
  @Patch('updateUser')
  updateUser(@Body() dto: UpdateUserDto) {
    return this.userService.updateUserService(dto);
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiParam({ name: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Delete('deleteUser/:uuid')
  deleteUser(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.userService.deleteUserService(uuid);
  }
}
