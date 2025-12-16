import { Type } from "class-transformer";
import { IsMongoId, IsNumber, IsOptional, IsPositive, IsString, Length, MaxLength,  MinLength } from "class-validator";
import { Types } from "mongoose";
import {  IProduct } from "src/common";

export class CreateProductDto implements Partial<IProduct> {
    @MaxLength(25)
    @IsMongoId()
    brands: Types.ObjectId 
    @IsMongoId()
    category: Types.ObjectId;
    
    @Length(2,2000)
    @IsString()
    name: string;
    
    @MaxLength(50000)
    @MinLength(2)
    @IsString()
    @IsOptional()
    description: string


    @Type(()=>Number)
    @IsNumber()
    @IsPositive()
    @IsOptional()
    discount: number;

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    mainPrice: number;
    
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    stock?: number ;
}
