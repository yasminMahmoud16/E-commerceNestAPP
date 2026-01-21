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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = exports.Product = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
let Product = class Product {
    name;
    slug;
    description;
    image;
    images;
    mainPrice;
    salePrice;
    discount;
    soldItems;
    stock;
    createdBy;
    updatedBy;
    brands;
    category;
    assetFolderId;
    freezedAt;
    restoredAt;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 2, maxlength: 2000 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, minlength: 2, maxlength: 50 }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, minlength: 2, maxlength: 50000 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        secure_url: { type: String, },
        public_id: { type: String, },
    })),
    __metadata("design:type", Object)
], Product.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)([{
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        }])),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "mainPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, }),
    __metadata("design:type", Number)
], Product.prototype, "salePrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "soldItems", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Types.ObjectId, ref: "Brand", required: true }]),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "brands", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: mongoose_2.Types.ObjectId, ref: "Category", required: true }]),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Product.prototype, "assetFolderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Product.prototype, "freezedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Product.prototype, "restoredAt", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, strictQuery: true })
], Product);
exports.productSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.productSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
exports.productSchema.pre("save", async function (next) {
    if (this.isModified('name')) {
        this.slug = (0, slugify_1.default)(this.name);
    }
    next();
});
exports.productSchema.pre(['updateOne', 'findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (update.name) {
        this.setUpdate({ ...update,
            slug: (0, slugify_1.default)(update.name)
        });
    }
    const query = this.getQuery();
    if (query.paranoId === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
exports.productSchema.pre(['findOne', 'find'], async function (next) {
    const query = this.getQuery();
    if (query.paranoId === false) {
        this.setQuery({ ...query });
    }
    else {
        this.setQuery({ ...query, freezedAt: { $exists: false } });
    }
    next();
});
//# sourceMappingURL=product.model.js.map