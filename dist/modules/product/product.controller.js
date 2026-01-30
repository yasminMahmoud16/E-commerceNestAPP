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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("../../common/utils/multer");
const product_service_1 = require("./product.service");
const product_authorization_module_1 = require("./product.authorization.module");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async create(user, createProductDto, files) {
        const product = await this.productService.create(createProductDto, files, user);
        return (0, common_2.successResponse)({ status: 201, data: { product } });
    }
    async update(params, updateProductDto, user) {
        const product = await this.productService.update(params.productId, updateProductDto, user);
        return (0, common_2.successResponse)({ data: { product } });
    }
    async updateAttachment(params, updateProductAttachmentDto, user, files) {
        const product = await this.productService.updateAttachment(params.productId, updateProductAttachmentDto, user, files);
        return (0, common_2.successResponse)({ data: { product } });
    }
    async findAll(query) {
        const result = await this.productService.findAll(query);
        return (0, common_2.successResponse)({ data: { result } });
    }
    async findAllArchiveBrand(query) {
        const result = await this.productService.findAll(query, true);
        return (0, common_2.successResponse)({ data: { result } });
    }
    async findOne(params) {
        const product = await this.productService.findOne(params.productId);
        return (0, common_2.successResponse)({ data: { product } });
    }
    async findOneArchive(params) {
        const product = await this.productService.findOne(params.productId, true);
        return (0, common_2.successResponse)({ data: { product } });
    }
    async softDelete(params, user) {
        await this.productService.softDelete(params.productId, user);
        return (0, common_2.successResponse)();
    }
    async restore(params, user) {
        const product = await this.productService.restore(params.productId, user);
        return (0, common_2.successResponse)({ data: { product } });
    }
    async remove(params, user) {
        await this.productService.remove(params.productId, user);
        return (0, common_2.successResponse)();
    }
    async addToWishlist(user, params) {
        const product = await this.productService.addToWishlist(params.productId, user);
        return (0, common_2.successResponse)({ data: { product } });
    }
    async removeFromWishlist(user, params) {
        await this.productService.removeFromWishlist(params.productId, user);
        return (0, common_2.successResponse)();
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("attachments", 5, (0, multer_1.cloudFileUpload)({
        storageApproach: common_2.StorageEnum.disk,
        validation: multer_1.fileValidation.image
    }))),
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Post)(),
    __param(0, (0, common_2.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)(common_1.ParseFilePipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Patch)(':productId'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto,
        update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("attachments", 5, (0, multer_1.cloudFileUpload)({
        storageApproach: common_2.StorageEnum.disk,
        validation: multer_1.fileValidation.image
    }))),
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Patch)(':productId/attachment'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.User)()),
    __param(3, (0, common_1.UploadedFiles)(new common_1.ParseFilePipe({ fileIsRequired: false }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto,
        update_product_dto_1.UpdateProductAttachmentDto, Object, Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateAttachment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.GetAllDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Get)("archive"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.GetAllDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAllArchiveBrand", null);
__decorate([
    (0, common_1.Get)(':productId'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Get)(':productId/archive'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOneArchive", null);
__decorate([
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Delete)(':productId/freeze'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "softDelete", null);
__decorate([
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Patch)(':productId/restore'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "restore", null);
__decorate([
    (0, common_2.Auth)(product_authorization_module_1.endPoint.create),
    (0, common_1.Delete)(':productId/hard-delete'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_product_dto_1.ProductParamDto, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "remove", null);
__decorate([
    (0, common_2.Auth)([common_2.RoleEnum.user]),
    (0, common_1.Patch)(":productId/add-to-wishlist"),
    __param(0, (0, common_2.User)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_product_dto_1.ProductParamDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addToWishlist", null);
__decorate([
    (0, common_2.Auth)([common_2.RoleEnum.user]),
    (0, common_1.Patch)(":productId/remove-from-wishlist"),
    __param(0, (0, common_2.User)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_product_dto_1.ProductParamDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "removeFromWishlist", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })),
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map