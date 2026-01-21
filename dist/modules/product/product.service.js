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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const DB_1 = require("../../DB");
const brand_repository_1 = require("../../DB/repository/brand.repository");
const common_2 = require("../../common");
const crypto_1 = require("crypto");
let ProductService = class ProductService {
    brandRepository;
    categoryRepository;
    productRepository;
    s3Service;
    cloudinaryService;
    constructor(brandRepository, categoryRepository, productRepository, s3Service, cloudinaryService) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.s3Service = s3Service;
        this.cloudinaryService = cloudinaryService;
    }
    async create(createProductDto, files, user) {
        if (!user || !user._id) {
            throw new common_1.UnauthorizedException("User is required to create a brand");
        }
        const category = await this.categoryRepository.findOne({
            filter: { _id: createProductDto.category }
        });
        if (!category) {
            throw new common_1.NotFoundException("Failed to find matching category");
        }
        const brand = await this.brandRepository.findOne({
            filter: { _id: createProductDto.brands }
        });
        if (!brand) {
            throw new common_1.NotFoundException("Failed to find matching brand");
        }
        const { name, description, discount, mainPrice, stock } = createProductDto;
        let assetFolderId = (0, crypto_1.randomUUID)();
        const images = await this.cloudinaryService.uploadFiles({
            files,
            path: `${common_2.FolderEnum.Category}/${createProductDto.category}/${common_2.FolderEnum.Product}/${assetFolderId}`
        });
        const [product] = await this.productRepository.create({
            data: [{
                    category: category._id,
                    brands: brand._id,
                    name,
                    description,
                    discount,
                    mainPrice,
                    salePrice: mainPrice - mainPrice * (discount / 100),
                    stock,
                    assetFolderId,
                    images,
                    createdBy: user._id
                }]
        });
        if (!product) {
            throw new common_1.BadRequestException("Failed to create this product resource ");
        }
        return product;
    }
    async update(productId, updateProductDto, user) {
        const findProduct = await this.productRepository.findOne({
            filter: { _id: productId }
        });
        if (!findProduct) {
            throw new common_1.NotFoundException("there is no result match");
        }
        if (updateProductDto.category) {
            const category = await this.categoryRepository.findOne({
                filter: { _id: updateProductDto.category }
            });
            if (!category) {
                throw new common_1.NotFoundException("Failed to find matching category");
            }
        }
        if (updateProductDto.brands) {
            const brand = await this.brandRepository.findOne({
                filter: { _id: updateProductDto.brands }
            });
            if (!brand) {
                throw new common_1.NotFoundException("Failed to find matching brand");
            }
        }
        let salePrice = findProduct.mainPrice;
        if (updateProductDto.mainPrice || updateProductDto.discount) {
            const mainPrice = updateProductDto.mainPrice ?? findProduct.mainPrice;
            const discountPrice = updateProductDto.discount ?? findProduct.discount;
            const finalPrice = mainPrice - (mainPrice * (discountPrice / 100));
            salePrice = finalPrice > 0 ? finalPrice : 1;
        }
        const product = await this.productRepository.findOneAndUpdate({
            filter: { _id: productId },
            update: {
                ...updateProductDto,
                salePrice,
                updatedBy: user._id
            }
        });
        if (!product) {
            throw new common_1.BadRequestException("Failed to update this product resource ");
        }
        return product;
    }
    async updateAttachment(productId, updateProductAttachmentDto, user, files) {
        const findProduct = await this.productRepository.findOne({
            filter: { _id: productId },
            options: {
                populate: [
                    {
                        path: "category"
                    }
                ]
            }
        });
        if (!findProduct) {
            throw new common_1.NotFoundException("there is no result match");
        }
        let attachments = [];
        if (files?.length) {
            attachments = await this.cloudinaryService.uploadFiles({
                files,
                path: `${common_2.FolderEnum.Category}/${findProduct.category.assetFolderId}/${common_2.FolderEnum.Product}/${findProduct.assetFolderId}`
            });
        }
        const removedAttachment = [...new Set(updateProductAttachmentDto.removedAttachment ?? [])];
        const product = await this.productRepository.findOneAndUpdate({
            filter: { _id: productId },
            update: [
                {
                    $set: {
                        images: {
                            $setUnion: [
                                {
                                    $setDifference: [
                                        "$images",
                                        removedAttachment
                                    ]
                                },
                                attachments
                            ]
                        },
                        updatedBy: user._id
                    }
                }
            ]
        });
        if (!product) {
            await this.cloudinaryService.deleteFiles(attachments.map(img => img.public_id));
            throw new common_1.BadRequestException("Failed to update this product resource ");
        }
        await this.cloudinaryService.deleteFiles(removedAttachment);
        return product;
    }
    async softDelete(productId, user) {
        const product = await this.productRepository.findOneAndUpdate({
            filter: {
                _id: productId
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
        if (!product) {
            throw new common_1.NotFoundException("Fail to find matching product");
        }
        return "Product deleted successfully";
    }
    async restore(productId, user) {
        const product = await this.productRepository.findOneAndUpdate({
            filter: {
                _id: productId,
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
        if (!product) {
            throw new common_1.NotFoundException("Fail to find matching product");
        }
        return product;
    }
    async remove(productId, user) {
        const product = await this.productRepository.findOneAndDelete({
            filter: {
                _id: productId,
                paranoId: false,
                freezedAt: { $exists: true }
            }
        });
        if (!product) {
            throw new common_1.NotFoundException("Fail to find matching result");
        }
        await this.cloudinaryService.deleteFiles(product.images.map(img => img.public_id));
        return "Done";
    }
    async findAll(data, archive = false) {
        const { page, size, search } = data;
        const products = await this.productRepository.paginate({
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
        return products;
    }
    async findOne(productId, archive = false) {
        const product = await this.productRepository.findOne({
            filter: {
                _id: productId,
                ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
            },
        });
        if (!product) {
            throw new common_1.NotFoundException("failed to find matching product");
        }
        return product;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [brand_repository_1.BrandRepository,
        DB_1.CategoryRepository,
        DB_1.ProductRepository,
        common_2.S3Service,
        common_2.CloudService])
], ProductService);
//# sourceMappingURL=product.service.js.map