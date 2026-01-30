import { Module } from '@nestjs/common';
import { CloudService, S3Service } from 'src/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import {  Brand, BrandRepository, brandSchema, Category, CategoryRepository, categorySchema, Product, ProductRepository, productSchema, UserRepository } from 'src/DB';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: Brand.name, schema: brandSchema },
      { name: Category.name, schema: categorySchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, BrandRepository, CategoryRepository, S3Service, CloudService, UserRepository],
})
export class ProductModule {}
