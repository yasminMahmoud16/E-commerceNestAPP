import { HydratedDocument, Types } from "mongoose";
import { ICategory } from "src/common";
export declare class Category implements ICategory {
    name: string;
    slug: string;
    description: string;
    image: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
    brands?: Types.ObjectId[];
    assetFolderId: string;
    freezedAt?: Date;
    restoredAt?: Date;
}
export type CategoryDocument = HydratedDocument<Category>;
export declare const categorySchema: import("mongoose").Schema<Category, import("mongoose").Model<Category, any, any, any, import("mongoose").Document<unknown, any, Category, any, {}> & Category & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Category, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Category>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Category> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
