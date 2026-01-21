import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsOptional, Validate } from "class-validator";
import { Types } from "mongoose";
import { ContainField, MongoDbId } from 'src/common';
import { CreateCategoryDto } from './create-category.dto';


@ContainField()
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @Validate(MongoDbId)
    @IsOptional()
    removeBrands:Types.ObjectId[]
}
export class CategoryParamDto{
    @IsMongoId()
    categoryId:Types.ObjectId
}
