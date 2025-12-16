import { IResponse } from 'src/common';
import type { UserDocument } from 'src/DB';
import { CategoryService } from './category.service';
import { CategoryResponse, GetAllResponse } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryParamDto, GetAllDto, UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(user: UserDocument, createCategoryDto: CreateCategoryDto, file: Express.Multer.File): Promise<IResponse<CategoryResponse>>;
    update(params: CategoryParamDto, updateCategoryDto: UpdateCategoryDto, user: UserDocument): Promise<IResponse<CategoryResponse>>;
    updateAttachment(params: CategoryParamDto, file: Express.Multer.File, user: UserDocument): Promise<IResponse<CategoryResponse>>;
    findAll(query: GetAllDto): Promise<IResponse<GetAllResponse>>;
    findAllArchiveBrand(query: GetAllDto): Promise<IResponse<GetAllResponse>>;
    findOne(params: CategoryParamDto): Promise<{
        message: string;
        status: number;
        data: CategoryResponse | undefined;
    }>;
    findOneArchive(params: CategoryParamDto): Promise<{
        message: string;
        status: number;
        data: CategoryResponse | undefined;
    }>;
    softDelete(params: CategoryParamDto, user: UserDocument): Promise<IResponse>;
    restore(params: CategoryParamDto, user: UserDocument): Promise<IResponse>;
    remove(params: CategoryParamDto, user: UserDocument): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
}
