import { Types } from "mongoose";
import { IProduct } from "src/common";
export declare class CreateProductDto implements Partial<IProduct> {
    brands: Types.ObjectId;
    category: Types.ObjectId;
    name: string;
    description: string;
    discount: number;
    mainPrice: number;
    stock?: number;
}
