import { Module } from '@nestjs/common';
import { S3Service } from 'src/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Brand, BrandRepository, brandSchema, Category, CategoryRepository, categorySchema } from 'src/DB';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: categorySchema },
      { name: Brand.name, schema: brandSchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, BrandRepository, S3Service],
})
export class CategoryModule {}
