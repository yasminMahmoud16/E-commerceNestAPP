"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const brand_repository_1 = require("../../DB/repository/brand.repository");
const common_2 = require("../../common");
const node_crypto_1 = require("node:crypto");
let BrandService = class BrandService {
    brandRepository;
    s3Service;
    cloudinaryService;
    constructor(brandRepository, s3Service, cloudinaryService) {
        this.brandRepository = brandRepository;
        this.s3Service = s3Service;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createBrandDto, file, user) {
        if (!user || !user._id) {
            throw new common_1.UnauthorizedException("User is required to create a brand");
        }
        const { name, slogan } = createBrandDto;
        const checkDuplicate = await this.brandRepository.findOne({
            filter: { name, paranoId: false }
        });
        if (checkDuplicate) {
            throw new common_1.ConflictException(checkDuplicate.freezedAt ? "Duplicated with archived brand" : "Duplicated Brand Name");
        }
        console.log({ file });
        let assetFolderId = (0, node_crypto_1.randomUUID)();
        const image = await this.cloudinaryService.uploadFile({
            file,
            path: `${common_2.FolderEnum.Brand}/${assetFolderId}`,
        });
        console.log({ image });
        const [brand] = await this.brandRepository.create({
            data: [{
                    name,
                    slogan,
                    image,
                    createdBy: user._id
                }]
        });
        console.log({ brand });
        if (!brand) {
            await this.cloudinaryService.deleteFile({ public_id: image.public_id });
            throw new common_1.BadRequestException("Failed to create this brand resource");
        }
        return brand;
    }
    async update(brandId, updateBrandDto, user) {
        if (updateBrandDto.name && await this.brandRepository.findOne({ filter: { name: updateBrandDto.name } })) {
            throw new common_1.ConflictException("Duplicated brand name");
        }
        const brand = await this.brandRepository.findOneAndUpdate({
            filter: { _id: brandId },
            update: {
                ...updateBrandDto,
                updatedBy: user._id
            }
        });
        if (!brand) {
            throw new common_1.NotFoundException("failed to find matching brand instance ");
        }
        return brand;
    }
    async updateAttachment(brandId, file, user) {
        const image = await this.cloudinaryService.uploadFile({ file, path: common_2.FolderEnum.Brand });
        const brand = await this.brandRepository.findOneAndUpdate({
            filter: { _id: brandId },
            update: {
                image,
                updatedBy: user._id
            },
            options: {
                new: false
            }
        });
        if (!brand) {
            await this.cloudinaryService.deleteFile({ public_id: image.public_id });
            throw new common_1.NotFoundException("failed to find matching brand instance ");
        }
        await this.cloudinaryService.deleteFile({ public_id: brand.image.public_id });
        brand.image.public_id = image.public_id;
        return brand;
    }
    async softDelete(brandId, user) {
        const brand = await this.brandRepository.findOneAndUpdate({
            filter: {
                _id: brandId
            },
            update: {
                freezedAt: new Date(),
                $unset: {
                    restoredAt: true
                },
                updatedBy: user._id
            },
            options: {
                new: false
            }
        });
        if (!brand) {
            throw new common_1.NotFoundException("Fail to find matching brand");
        }
        return "Brand deleted successfully";
    }
    async restore(brandId, user) {
        const brand = await this.brandRepository.findOneAndUpdate({
            filter: {
                _id: brandId,
                paranoId: false,
                freezedAt: { $exists: true }
            },
            update: {
                restoredAt: new Date(),
                $unset: {
                    freezedAt: true
                },
                updatedBy: user._id
            },
            options: {
                new: false
            }
        });
        if (!brand) {
            throw new common_1.NotFoundException("Fail to find matching brand");
        }
        return brand;
    }
    async remove(brandId, user) {
        const brand = await this.brandRepository.findOneAndDelete({
            filter: {
                _id: brandId,
                paranoId: false,
                freezedAt: { $exists: true }
            }
        });
        if (!brand) {
            throw new common_1.NotFoundException("Fail to find matching result");
        }
        await this.cloudinaryService.deleteFile({ public_id: brand.image.public_id });
        return "Done";
    }
    async findAll(data, archive = false) {
        const { page, size, search } = data;
        const brands = await this.brandRepository.paginate({
            filter: {
                ...(search ? {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { slug: { $regex: search, $options: "i" } },
                        { slogan: { $regex: search, $options: "i" } }
                    ]
                } : {}),
                ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
            },
            page,
            size
        });
        return brands;
    }
    async findOne(brandId, archive = false) {
        const brand = await this.brandRepository.findOne({
            filter: {
                _id: brandId,
                ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
            },
        });
        if (!brand) {
            throw new common_1.NotFoundException("failed to find matching brand");
        }
        return brand;
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [brand_repository_1.BrandRepository,
        common_2.S3Service,
        common_2.CloudService])
], BrandService);
//# sourceMappingURL=brand.service.js.map