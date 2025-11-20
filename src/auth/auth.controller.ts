import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loggingUserDto } from 'src/user/Dtos/loggingUser.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({ summary: 'Autenticar usuario' })
  @ApiResponse({ status: 200, description: 'Autenticado' })
  @Post('loggingUser')
  loggingUser(@Body() dto: loggingUserDto) {
    return this.authService.loggingUserService(dto);
  }
}
