import { HydratedDocument, Types } from "mongoose";
import { IProduct } from "src/common/interfaces/product.interface";
export declare class Product implements IProduct {
    name: string;
    slug: string;
    description: string;
    image: string;
    images: string[];
    mainPrice: number;
    salePrice: number;
    discount: number;
    soldItems: number;
    stock: number;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    brands: Types.ObjectId;
    category: Types.ObjectId;
    assetFolderId: string;
    freezedAt?: Date;
    restoredAt?: Date;
}
export type ProductDocument = HydratedDocument<Product>;
export declare const productSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, import("mongoose").Document<unknown, any, Product, any, {}> & Product & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
