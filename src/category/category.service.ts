import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { CategoryRepository } from './repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoriesRepository: CategoryRepository) {}

  async getActiveCategories() {
    const categories = await this.categoriesRepository.findActiveCategories();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('No hay categorías activas');
    }
    return categories;
  }

  async postCreateCategory(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepository.findCategoryByName(
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException(
        'Ya existe una categoría con el nombre ingresado',
      );
    }

    return await this.categoriesRepository.createCategory(createCategoryDto);
  }

  async putUpdateCategory(updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findCategoryByUuid(
      updateCategoryDto.uuid,
    );

    if (!category) {
      throw new NotFoundException(
        'No existe una categoría con el UUID ingresado',
      );
    }

    return await this.categoriesRepository.updateCategory(
      category,
      updateCategoryDto,
    );
  }

  async activateCategory(uuid: string) {
    const category = await this.categoriesRepository.findCategoryByUuid(uuid);

    if (!category) {
      throw new NotFoundException('No existe una categoría con ese UUID');
    }

    if (category.isActive) {
      return { message: 'La categoría ya está activa', category };
    }

    return this.categoriesRepository.activateCategory(category);
  }

  async deleteCategory(uuid: string) {
    const category = await this.categoriesRepository.findCategoryByUuid(uuid);

    if (!category || !category.isActive) {
      throw new NotFoundException(
        'No existe una categoría activa con el UUID ingresado',
      );
    }

    return await this.categoriesRepository.softDeleteCategory(category);
  }
}
