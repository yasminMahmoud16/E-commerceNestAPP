"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../common");
const mongoose_1 = require("@nestjs/mongoose");
const product_controller_1 = require("./product.controller");
const DB_1 = require("../../DB");
const product_service_1 = require("./product.service");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: DB_1.Product.name, schema: DB_1.productSchema },
                { name: DB_1.Brand.name, schema: DB_1.brandSchema },
                { name: DB_1.Category.name, schema: DB_1.categorySchema },
            ]),
        ],
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService, DB_1.ProductRepository, DB_1.BrandRepository, DB_1.CategoryRepository, common_2.S3Service],
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map