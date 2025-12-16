import { IResponse } from 'src/common';
import type { UserDocument } from 'src/DB';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllResponse, ProductResponse } from './entities/product.entity';
import { GetAllDto, ProductParamDto, UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(user: UserDocument, createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<IResponse<ProductResponse>>;
    update(params: ProductParamDto, updateProductDto: UpdateProductDto, user: UserDocument): Promise<IResponse<ProductResponse>>;
    updateAttachment(params: ProductParamDto, file: Express.Multer.File, user: UserDocument): Promise<IResponse<ProductResponse>>;
    findAll(query: GetAllDto): Promise<IResponse<GetAllResponse>>;
    findAllArchiveBrand(query: GetAllDto): Promise<IResponse<GetAllResponse>>;
    findOne(params: ProductParamDto): Promise<{
        message: string;
        status: number;
        data: ProductResponse | undefined;
    }>;
    findOneArchive(params: ProductParamDto): Promise<{
        message: string;
        status: number;
        data: ProductResponse | undefined;
    }>;
    softDelete(params: ProductParamDto, user: UserDocument): Promise<IResponse>;
    restore(params: ProductParamDto, user: UserDocument): Promise<IResponse>;
    remove(params: ProductParamDto, user: UserDocument): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
}
