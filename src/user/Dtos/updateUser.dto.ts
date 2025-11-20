import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'UUID del usuario a actualizar' })
  @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  @IsUUID('4', { message: 'El id del usuario debe tener un formato UUID' })
  uuid_user: string;
}
