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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const DB_1 = require("../../DB");
const common_2 = require("../../common");
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
let CategoryService = class CategoryService {
    categoryRepository;
    brandRepository;
    s3Service;
    cloudinaryService;
    constructor(categoryRepository, brandRepository, s3Service, cloudinaryService) {
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.s3Service = s3Service;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createCategoryDto, file, user) {
        if (!user || !user._id) {
            throw new common_1.UnauthorizedException("User is required to create a category");
        }
        const { name } = createCategoryDto;
        const checkDuplicate = await this.categoryRepository.findOne({
            filter: { name, paranoId: false }
        });
        if (checkDuplicate) {
            throw new common_1.ConflictException(checkDuplicate.freezedAt ? "Duplicated with archived category" : "Duplicated category Name");
        }
        const brands = [...new Set(createCategoryDto.brands || [])];
        if (brands && (await this.brandRepository.find({ filter: { _id: { $in: brands } } })).length != brands.length) {
            throw new common_1.NotFoundException("some of mentioned brands are not exists");
        }
        let assetFolderId = (0, crypto_1.randomUUID)();
        const image = await this.cloudinaryService.uploadFile({
            file,
            path: `${common_2.FolderEnum.Category}/${assetFolderId}`
        });
        console.log({ image });
        const [category] = await this.categoryRepository.create({
            data: [{
                    ...createCategoryDto,
                    image,
                    assetFolderId,
                    createdBy: user._id,
                    brands: brands.map(brand => { return mongoose_1.Types.ObjectId.createFromHexString(brand); })
                }]
        });
        console.log({ category });
        if (!category) {
            await this.cloudinaryService.deleteFile({ public_id: image.public_id });
            throw new common_1.BadRequestException("Failed to create this category resource ");
        }
        return category;
    }
    async update(categoryId, updateCategoryDto, user) {
        if (updateCategoryDto.name && await this.categoryRepository.findOne({ filter: { name: updateCategoryDto.name } })) {
            throw new common_1.ConflictException("Duplicated category name");
        }
        const brands = [...new Set(updateCategoryDto.brands || [])];
        if (brands && (await this.brandRepository.find({ filter: { _id: { $in: brands } } })).length != brands.length) {
            throw new common_1.NotFoundException("some of mentioned brands are not exists");
        }
        const removeBrands = updateCategoryDto.removeBrands ?? [];
        delete updateCategoryDto.removeBrands;
        const category = await this.categoryRepository.findOneAndUpdate({
            filter: { _id: categoryId },
            update: [
                {
                    $set: {
                        ...updateCategoryDto,
                        updateBy: user._id,
                        brands: {
                            $setUnion: [
                                {
                                    $setDifference: [
                                        "$brands",
                                        (removeBrands || []).map((brand) => {
                                            return mongoose_1.Types.ObjectId.createFromHexString(brand);
                                        })
                                    ]
                                },
                                brands.map((brand) => {
                                    return mongoose_1.Types.ObjectId.createFromHexString(brand);
                                })
                            ]
                        }
                    }
                }
            ]
        });
        if (!category) {
            throw new common_1.NotFoundException("failed to find matching brand instance ");
        }
        return category;
    }
    async updateAttachment(categoryId, file, user) {
        const category = await this.categoryRepository.findOne({
            filter: { _id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException("failed to find matching category instance ");
        }
        const image = await this.cloudinaryService.uploadFile({
            file,
            path: `${common_2.FolderEnum.Category}/${category.assetFolderId}`
        });
        const updateCategory = await this.categoryRepository.findOneAndUpdate({
            filter: { _id: categoryId },
            update: {
                image,
                updatedBy: user._id
            },
            options: {
                new: true
            }
        });
        if (!updateCategory) {
            await this.cloudinaryService.deleteFile({ public_id: image.public_id });
            throw new common_1.NotFoundException("failed to find matching category instance ");
        }
        await this.cloudinaryService.deleteFile({ public_id: category.image.public_id });
        return updateCategory;
    }
    async softDelete(categoryId, user) {
        const category = await this.categoryRepository.findOneAndUpdate({
            filter: {
                _id: categoryId
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
        if (!category) {
            throw new common_1.NotFoundException("Fail to find matching category");
        }
        return "category deleted successfully";
    }
    async restore(categoryId, user) {
        const category = await this.categoryRepository.findOneAndUpdate({
            filter: {
                _id: categoryId,
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
        if (!category) {
            throw new common_1.NotFoundException("Fail to find matching category");
        }
        return category;
    }
    async remove(categoryId, user) {
        const category = await this.categoryRepository.findOneAndDelete({
            filter: {
                _id: categoryId,
                paranoId: false,
                freezedAt: { $exists: true }
            }
        });
        if (!category) {
            throw new common_1.NotFoundException("Fail to find matching result");
        }
        await this.cloudinaryService.deleteFile({ public_id: category.image.public_id });
        return "Done";
    }
    async findAll(data, archive = false) {
        const { page, size, search } = data;
        const categories = await this.categoryRepository.paginate({
            filter: {
                ...(search ? {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { slug: { $regex: search, $options: "i" } },
                        { description: { $regex: search, $options: "i" } }
                    ]
                } : {}),
                ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
            },
            page,
            size
        });
        return categories;
    }
    async findOne(brandId, archive = false) {
        const brand = await this.categoryRepository.findOne({
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
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DB_1.CategoryRepository,
        DB_1.BrandRepository,
        common_2.S3Service,
        common_2.CloudService])
], CategoryService);
//# sourceMappingURL=category.service.js.map