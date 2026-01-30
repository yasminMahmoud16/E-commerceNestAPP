import { CategoryRepository, Lean, ProductDocument, ProductRepository, UserDocument, UserRepository } from 'src/DB';
import { BrandRepository } from '../../DB/repository/brand.repository';
import { CloudService, GetAllDto } from 'src/common';
import { Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductAttachmentDto, UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly brandRepository;
    private readonly categoryRepository;
    private readonly productRepository;
    private readonly userRepository;
    private readonly cloudinaryService;
    constructor(brandRepository: BrandRepository, categoryRepository: CategoryRepository, productRepository: ProductRepository, userRepository: UserRepository, cloudinaryService: CloudService);
    create(createProductDto: CreateProductDto, files: Express.Multer.File[], user: UserDocument): Promise<ProductDocument>;
    update(productId: Types.ObjectId, updateProductDto: UpdateProductDto, user: UserDocument): Promise<ProductDocument | Lean<ProductDocument>>;
    updateAttachment(productId: Types.ObjectId, updateProductAttachmentDto: UpdateProductAttachmentDto, user: UserDocument, files?: Express.Multer.File[]): Promise<ProductDocument | Lean<ProductDocument>>;
    softDelete(productId: Types.ObjectId, user: UserDocument): Promise<string>;
    restore(productId: Types.ObjectId, user: UserDocument): Promise<ProductDocument | Lean<ProductDocument>>;
    remove(productId: Types.ObjectId, user: UserDocument): Promise<string>;
    findAll(data: GetAllDto, archive?: boolean): Promise<{
        docsCount?: number;
        limit?: number;
        page?: number;
        currentPage?: number | undefined;
        result: ProductDocument[] | Lean<ProductDocument>[];
    }>;
    findOne(productId: Types.ObjectId, archive?: boolean): Promise<ProductDocument | Lean<ProductDocument>>;
    addToWishlist(productId: Types.ObjectId, user: UserDocument): Promise<ProductDocument | Lean<ProductDocument>>;
    removeFromWishlist(productId: Types.ObjectId, user: UserDocument): Promise<String>;
}
