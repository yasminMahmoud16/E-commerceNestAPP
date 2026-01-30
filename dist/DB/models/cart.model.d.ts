import { HydratedDocument, Types } from "mongoose";
import type { ICart, ICartProduct } from "src/common";
export declare class CartProduct implements ICartProduct {
    productId: Types.ObjectId;
    quantity: number;
    createdBy?: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}
export declare class Cart implements ICart {
    products: CartProduct[];
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId;
}
export type CartDocument = HydratedDocument<Cart>;
export type CartProductDocument = HydratedDocument<CartProduct>;
export declare const cartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, import("mongoose").Document<unknown, any, Cart, any, {}> & Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Cart>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cart> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
