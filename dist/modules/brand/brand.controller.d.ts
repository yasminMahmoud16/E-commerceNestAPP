import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { IResponse } from 'src/common';
import type { UserDocument } from 'src/DB';
import { BrandResponse, GetAllResponse } from './entities/brand.entity';
import { BrandParamDto, GetAllDto } from './dto/update-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(user: UserDocument, createBrandDto: CreateBrandDto, file: Express.Multer.File): Promise<IResponse<BrandResponse>>;
    update(params: BrandParamDto, updateBrandDto: UpdateBrandDto, user: UserDocument): Promise<IResponse<BrandResponse>>;
    updateAttachment(params: BrandParamDto, file: Express.Multer.File, user: UserDocument): Promise<IResponse<BrandResponse>>;
    findAll(query: GetAllDto): Promise<IResponse<GetAllResponse>>;
    findAllArchiveBrand(query: GetAllDto): Promise<IResponse<GetAllResponse>>;
    findOne(params: BrandParamDto): Promise<{
        message: string;
        status: number;
        data: BrandResponse | undefined;
    }>;
    findOneArchive(params: BrandParamDto): Promise<{
        message: string;
        status: number;
        data: BrandResponse | undefined;
    }>;
    softDelete(params: BrandParamDto, user: UserDocument): Promise<IResponse>;
    restore(params: BrandParamDto, user: UserDocument): Promise<IResponse>;
    remove(params: BrandParamDto, user: UserDocument): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
}
