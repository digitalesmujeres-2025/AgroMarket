import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';
import { BusinessModule } from 'src/business/business.module';
import { CategoryModule } from 'src/category/category.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    BusinessModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
