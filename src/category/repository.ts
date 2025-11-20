import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/categories.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryDataBase: Repository<Category>,
  ) {}

  async findActiveCategories() {
    return await this.categoryDataBase.find({
      where: { isActive: true },
    });
  }

  async findCategoryByUuid(uuid: string) {
    return await this.categoryDataBase.findOne({ where: { uuid: uuid } });
  }

  async findCategoryByName(name: string) {
    return await this.categoryDataBase.findOne({ where: { name } });
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryDataBase.create(createCategoryDto);
    return await this.categoryDataBase.save(newCategory);
  }

  async updateCategory(
    categoryExisting: Category,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    if (updateCategoryDto.name) {
      categoryExisting.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.description) {
      categoryExisting.description = updateCategoryDto.description;
    }

    await this.categoryDataBase.save(categoryExisting);
    return {
      message: 'Categoría actualizada correctamente',
      categoryExisting,
    };
  }

  async activateCategory(category: Category) {
    category.isActive = true;
    await this.categoryDataBase.save(category);

    return {
      message: 'Categoría activada correctamente',
      category,
    };
  }

  async softDeleteCategory(category: Category) {
    category.isActive = false;
    await this.categoryDataBase.save(category);
    return {
      message: 'Categoría desactivada correctamente',
      category,
    };
  }
}
