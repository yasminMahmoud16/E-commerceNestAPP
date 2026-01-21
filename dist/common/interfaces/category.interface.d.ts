import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { IBrand } from "./brand.interface";
import { IAttachment } from "./multer.interface";
export interface ICategory {
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    image: IAttachment;
    brands?: Types.ObjectId[] | IBrand[];
    assetFolderId: string;
    createdBy: Types.ObjectId | IUser;
    updatedBy?: Types.ObjectId | IUser;
    createdAt?: Date;
    updatedAt?: Date;
    freezedAt?: Date;
    restoredAt?: Date;
}
