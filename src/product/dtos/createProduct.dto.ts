import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Manzana Roja',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede superar 100 caracteres' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]+$/, {
    message: 'El nombre solo puede contener letras, números y espacios',
  })
  name: string;

  @ApiProperty({
    description: 'Código interno del producto',
    example: 101,
    type: Number,
  })
  @IsNotEmpty({ message: 'El código del producto es obligatorio' })
  @IsInt({ message: 'El código del producto debe ser un número entero' })
  @Type(() => Number)
  productCode: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 50,
    type: Number,
    minimum: 0,
  })
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiProperty({
    description: 'Precio base del producto',
    example: 2500,
    type: Number,
    minimum: 1,
  })
  @IsNotEmpty({ message: 'El precio actual es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(1, { message: 'El precio debe ser mayor a cero' })
  @Type(() => Number)
  basePrice: number;

  @ApiPropertyOptional({
    description: 'Porcentaje de IVA aplicado al producto',
    example: 0.19,
    type: Number,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El IVA debe ser un número' })
  @Min(0, { message: 'El IVA no puede ser negativo' })
  @Type(() => Number)
  iva?: number;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Manzana fresca de alta calidad',
    maxLength: 250,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9.,\s-]*$/, {
    message:
      'La descripción solo puede contener letras, números, espacios, comas y puntos',
  })
  description?: string;

  @ApiPropertyOptional({
    description:
      'URL con imagen del producto (formatos permitidos: jpg, jpeg, png, gif)',
    example: 'manzana.jpg',
  })
  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser un texto' })
  @Matches(/^.*\.(jpg|jpeg|png|gif)$/i, {
    message: 'La imagen debe tener una extensión válida (jpg, jpeg, png, gif)',
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'UUID de la categoría a la que pertenece el producto',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryUuid: string;

  @ApiProperty({
    description: 'UUID del negocio al que pertenece este producto',
    example: '660e8400-e29b-41d4-a716-123455440999',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  businessUuid: string;
}
