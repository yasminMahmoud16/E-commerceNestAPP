import { Types } from "mongoose";
import { ICartProduct } from "src/common";
export declare class CreateCartDto implements Partial<ICartProduct> {
    productId: Types.ObjectId;
    quantity: number;
}
