import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { Category } from '../entities/categories.entity';
import { ProductRepository } from './repository';
import { CategoryRepository } from 'src/category/repository';
import { Business } from 'src/entities/business.entity';
import { BusinessRepository } from 'src/business/repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private readonly categoriesRepository: CategoryRepository,
    private readonly businessRepository: BusinessRepository,
  ) {}

  async getProductById(uuid: string) {
    const product = await this.productsRepository.findProductByUuid(uuid);

    if (!product) {
      throw new NotFoundException('No existe un producto con ese UUID');
    }

    return {
      message: 'Producto encontrado',
      product,
    };
  }

  async getProductsByCategory(categoryUuid: string) {
    const existingCategory =
      await this.categoriesRepository.findCategoryByUuid(categoryUuid);
    if (!existingCategory || existingCategory.isActive === false) {
      throw new NotFoundException(
        'No se encuentra una categoría con el uuid ingresado',
      );
    }
    const products =
      await this.productsRepository.findProductsByCategory(categoryUuid);

    return products;
  }

  async postCreateProduct(createProductDto: CreateProductDto) {
    const existingByCode = await this.productsRepository.findProductByCode(
      createProductDto.productCode,
    );
    if (existingByCode) {
      throw new ConflictException(
        'Ya existe un producto con el código ingresado',
      );
    }

    const existingByName = await this.productsRepository.findProductByName(
      createProductDto.name,
    );
    if (existingByName) {
      throw new ConflictException(
        'Ya existe un producto con el nombre ingresado',
      );
    }

    const existingCategory = await this.categoriesRepository.findCategoryByUuid(
      createProductDto.categoryUuid,
    );
    if (!existingCategory || !existingCategory.isActive) {
      throw new NotFoundException(
        'No existe una categoría válida con el UUID ingresado',
      );
    }

    const existingBusiness = await this.businessRepository.findBusinessByUuid(
      createProductDto.businessUuid,
    );
    if (!existingBusiness || !existingBusiness.estado) {
      throw new NotFoundException('No existe un negocio válido con ese UUID');
    }

    return await this.productsRepository.createProduct(
      createProductDto,
      existingCategory,
      existingBusiness,
    );
  }

  async putUpdateProduct(updateProductDto: UpdateProductDto) {
    const existingProduct = await this.productsRepository.findProductByUuid(
      updateProductDto.uuid,
    );
    if (!existingProduct) {
      throw new NotFoundException(
        'No existe un producto con el UUID ingresado',
      );
    }

    if (updateProductDto.productCode) {
      const existingProduct = await this.productsRepository.findProductByCode(
        updateProductDto.productCode,
      );
      if (existingProduct && existingProduct.uuid !== updateProductDto.uuid) {
        throw new ConflictException(
          'Ya existe un producto registrado con ese código',
        );
      }
    }

    if (updateProductDto.name) {
      const existingProduct = await this.productsRepository.findProductByName(
        updateProductDto.name,
      );
      if (existingProduct && existingProduct.uuid !== updateProductDto.uuid) {
        throw new ConflictException(
          'Ya existe un producto registrado con ese nombre',
        );
      }
    }

    let newCategory: Category | undefined = undefined;
    if (updateProductDto.categoryUuid) {
      const existingCategory =
        await this.categoriesRepository.findCategoryByUuid(
          updateProductDto.categoryUuid,
        );

      if (!existingCategory || !existingCategory.isActive) {
        throw new NotFoundException(
          'No existe una categoría válida con ese UUID',
        );
      }

      newCategory = existingCategory;
    }

    let newBusiness: Business | undefined = undefined;
    if (updateProductDto.businessUuid) {
      const existingBusiness = await this.businessRepository.findBusinessByUuid(
        updateProductDto.businessUuid,
      );

      if (!existingBusiness || !existingBusiness.estado) {
        throw new NotFoundException('No existe un negocio válido con ese UUID');
      }

      newBusiness = existingBusiness;
    }

    return await this.productsRepository.updateProduct(
      existingProduct,
      updateProductDto,
      newCategory,
      newBusiness,
    );
  }

  async deleteProduct(uuid: string) {
    const product = await this.productsRepository.findProductByUuid(uuid);
    if (!product) {
      throw new NotFoundException('No existe un producto con ese UUID');
    }

    return await this.productsRepository.deleteProduct(product);
  }
}
