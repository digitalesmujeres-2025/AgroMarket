import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('El token es necesario');
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new BadRequestException('Configuracion del servidor incorrecto');
    }
    try {
      const secret = process.env.JWT_SECRET;
      const payload = this.jwtService.verify(token, { secret });
      payload.exp = new Date(payload.exp * 1000);
      payload.iat = new Date(payload.iat * 1000);
      console.log(payload);
      if (!payload.role) {
        throw new UnauthorizedException(
          'No tienes permisos para acceder a este contenido',
        );
      }
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token Invalido');
      }
      throw new UnauthorizedException('Error de autenticacion');
    }
  }
}
