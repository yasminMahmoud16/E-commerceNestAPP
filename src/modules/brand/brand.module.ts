import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from '../../DB/repository/brand.repository';
import { CloudService, S3Service } from 'src/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, brandSchema } from 'src/DB/models/brand.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: brandSchema }
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, S3Service, CloudService],
})
export class BrandModule {}
