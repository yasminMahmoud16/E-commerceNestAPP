import { HydratedDocument, Types } from "mongoose";
import { IBrand } from "src/common";
export declare class Brand implements IBrand {
    name: string;
    slug: string;
    slogan: string;
    image: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    freezedAt?: Date;
    restoredAt?: Date;
}
export type BrandDocument = HydratedDocument<Brand>;
export declare const brandSchema: import("mongoose").Schema<Brand, import("mongoose").Model<Brand, any, any, any, import("mongoose").Document<unknown, any, Brand, any, {}> & Brand & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Brand, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Brand>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Brand> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
