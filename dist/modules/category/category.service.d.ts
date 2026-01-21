import { BrandRepository, CategoryDocument, CategoryRepository, Lean, UserDocument } from 'src/DB';
import { CloudService, GetAllDto, S3Service } from 'src/common';
import { Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryService {
    private readonly categoryRepository;
    private readonly brandRepository;
    private readonly s3Service;
    private readonly cloudinaryService;
    constructor(categoryRepository: CategoryRepository, brandRepository: BrandRepository, s3Service: S3Service, cloudinaryService: CloudService);
    create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File, user: UserDocument): Promise<CategoryDocument>;
    update(categoryId: Types.ObjectId, updateCategoryDto: UpdateCategoryDto, user: UserDocument): Promise<CategoryDocument | Lean<CategoryDocument>>;
    updateAttachment(categoryId: Types.ObjectId, file: Express.Multer.File, user: UserDocument): Promise<CategoryDocument | Lean<CategoryDocument>>;
    softDelete(categoryId: Types.ObjectId, user: UserDocument): Promise<string>;
    restore(categoryId: Types.ObjectId, user: UserDocument): Promise<CategoryDocument | Lean<CategoryDocument>>;
    remove(categoryId: Types.ObjectId, user: UserDocument): Promise<string>;
    findAll(data: GetAllDto, archive?: boolean): Promise<{
        docsCount?: number;
        limit?: number;
        page?: number;
        currentPage?: number | undefined;
        result: CategoryDocument[] | Lean<CategoryDocument>[];
    }>;
    findOne(brandId: Types.ObjectId, archive?: boolean): Promise<CategoryDocument | Lean<CategoryDocument>>;
}
