import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Validate } from "class-validator";
import { Types } from "mongoose";
import { ContainField, MongoDbId } from 'src/common';
import { Type } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';
import { isValid } from 'zod/v3';


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
export class GetAllDto {
    @Type(()=>Number)
    @IsPositive()
    @IsNumber()
    @IsOptional()
    page: number;

    @Type(() => Number)
    @IsPositive()
    @IsNumber()
    @IsOptional()
    size: number;
    
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    search:string
}