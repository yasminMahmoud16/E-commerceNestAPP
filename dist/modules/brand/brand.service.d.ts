import { CreateBrandDto } from './dto/create-brand.dto';
import { Lean, UserDocument } from 'src/DB';
import { BrandDocument } from '../../DB/models/brand.model';
import { BrandRepository } from '../../DB/repository/brand.repository';
import { S3Service } from 'src/common';
import { Types } from 'mongoose';
import { GetAllDto, UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandService {
    private readonly brandRepository;
    private readonly s3Service;
    constructor(brandRepository: BrandRepository, s3Service: S3Service);
    create(createBrandDto: CreateBrandDto, file: Express.Multer.File, user: UserDocument): Promise<BrandDocument>;
    update(brandId: Types.ObjectId, updateBrandDto: UpdateBrandDto, user: UserDocument): Promise<BrandDocument | Lean<BrandDocument>>;
    updateAttachment(brandId: Types.ObjectId, file: Express.Multer.File, user: UserDocument): Promise<BrandDocument | Lean<BrandDocument>>;
    softDelete(brandId: Types.ObjectId, user: UserDocument): Promise<string>;
    restore(brandId: Types.ObjectId, user: UserDocument): Promise<BrandDocument | Lean<BrandDocument>>;
    remove(brandId: Types.ObjectId, user: UserDocument): Promise<string>;
    findAll(data: GetAllDto, archive?: boolean): Promise<{
        docsCount?: number;
        limit?: number;
        page?: number;
        currentPage?: number | undefined;
        result: BrandDocument[] | Lean<BrandDocument>[];
    }>;
    findOne(brandId: Types.ObjectId, archive?: boolean): Promise<BrandDocument | Lean<BrandDocument>>;
}
