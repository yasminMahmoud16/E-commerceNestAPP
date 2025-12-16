import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { IBrand } from "./brand.interface";
import { ICategory } from "./category.interface";


export interface IProduct{
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    images: string[];
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

    // for delete 
    freezedAt?: Date;
    restoredAt?: Date;




}