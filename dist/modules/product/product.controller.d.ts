import { GetAllDto, GetAllResponse, IProduct, IResponse } from 'src/common';
import type { UserDocument } from 'src/DB';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponse } from './entities/product.entity';
import { ProductParamDto, UpdateProductAttachmentDto, UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(user: UserDocument, createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<IResponse<ProductResponse>>;
    update(params: ProductParamDto, updateProductDto: UpdateProductDto, user: UserDocument): Promise<IResponse<ProductResponse>>;
    updateAttachment(params: ProductParamDto, updateProductAttachmentDto: UpdateProductAttachmentDto, user: UserDocument, files?: Express.Multer.File[]): Promise<IResponse<ProductResponse>>;
    findAll(query: GetAllDto): Promise<IResponse<GetAllResponse<IProduct>>>;
    findAllArchiveBrand(query: GetAllDto): Promise<IResponse<GetAllResponse<IProduct>>>;
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
    addToWishlist(user: UserDocument, params: ProductParamDto): Promise<IResponse<ProductResponse>>;
    removeFromWishlist(user: UserDocument, params: ProductParamDto): Promise<IResponse>;
}
