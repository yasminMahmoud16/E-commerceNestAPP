import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { IBrand } from "./brand.interface";
import { ICategory } from "./category.interface";
import { IAttachment } from "./multer.interface";
export interface IProduct {
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    image?: IAttachment;
    images: IAttachment[];
    assetFolderId: string;
    mainPrice: number;
    discount: number;
    salePrice?: number;
    stock: number;
    soldItems: number;
    brands: Types.ObjectId | IBrand;
    category: Types.ObjectId | ICategory;
    createdBy: Types.ObjectId | IUser;
    updatedBy?: Types.ObjectId | IUser;
    createdAt?: Date;
    updatedAt?: Date;
    freezedAt?: Date;
    restoredAt?: Date;
}
