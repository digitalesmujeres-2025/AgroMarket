import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/createProduct.dto';
import { Category } from '../entities/categories.entity';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { Business } from 'src/entities/business.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productDataBase: Repository<Product>,
  ) {}

  async findProductByUuid(uuid: string) {
    return await this.productDataBase.findOne({ where: { uuid } });
  }

  async findProductsByCategory(categoryUuid: string) {
    return await this.productDataBase.find({
      where: {
        category: {
          uuid: categoryUuid,
        },
      },
    });
  }

  async findProductByCode(productCode: number) {
    return await this.productDataBase.findOne({ where: { productCode } });
  }

  async findProductByName(name: string) {
    return await this.productDataBase.findOne({ where: { name } });
  }

  async createProduct(
    createProductDto: CreateProductDto,
    existingCategory: Category,
    existingBusiness: Business,
  ) {
    const product = this.productDataBase.create({
      productCode: createProductDto.productCode,
      name: createProductDto.name,
      stock: createProductDto.stock,
      basePrice: createProductDto.basePrice,
      iva: createProductDto.iva ?? 0,
      description: createProductDto.description,
      imageUrl: createProductDto.imageUrl,
      category: existingCategory,
      business: existingBusiness,
    });

    await this.productDataBase.save(product);
    return { message: 'Producto creado correctamente', product };
  }

  async updateProduct(
    existingProduct: Product,
    updateProductDto: UpdateProductDto,
    newCategory?: Category,
    newBusiness?: Business,
  ) {
    if (updateProductDto.productCode !== undefined) {
      existingProduct.productCode = updateProductDto.productCode;
    }

    if (updateProductDto.name !== undefined) {
      existingProduct.name = updateProductDto.name;
    }

    if (updateProductDto.stock !== undefined) {
      existingProduct.stock = updateProductDto.stock;
    }

    if (updateProductDto.basePrice !== undefined) {
      existingProduct.basePrice = updateProductDto.basePrice;
    }

    if (updateProductDto.iva !== undefined) {
      existingProduct.iva = updateProductDto.iva;
    }

    if (updateProductDto.description !== undefined) {
      existingProduct.description = updateProductDto.description;
    }

    if (updateProductDto.imageUrl !== undefined) {
      existingProduct.imageUrl = updateProductDto.imageUrl;
    }

    if (newCategory) {
      existingProduct.category = newCategory;
    }

    if (newBusiness) {
      existingProduct.business = newBusiness;
    }

    await this.productDataBase.save(existingProduct);
    return existingProduct;
  }

  async deleteProduct(product: Product) {
    product.isActive = false;
    await this.productDataBase.save(product);
    return { message: 'Producto desactivado correctamente' };
  }
}
