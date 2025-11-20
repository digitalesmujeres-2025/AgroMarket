import { CreateCategoryDto } from './createCategory.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Identificador único de la categoría',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'El id de la categoría es obligatorio' })
  @IsUUID('4', { message: 'El id debe tener formato UUID' })
  uuid: string;
}
