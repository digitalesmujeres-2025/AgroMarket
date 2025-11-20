import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoria',
    example: 'Frutas',
    minLength: 3,
    maxLength: 25,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede superar 25 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción breve de la categoría',
    example: 'Categoría relacionada con productos campesinos',
    maxLength: 250,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
