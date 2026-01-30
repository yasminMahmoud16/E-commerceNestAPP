import {  Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument, Types,  } from "mongoose";
import type{  ICart, ICartProduct, } from "src/common";

@Schema({timestamps:true, strictQuery:true})
export class CartProduct implements ICartProduct {
  
    @Prop({ type:Types.ObjectId, ref:"Product", required: true })
    productId: Types.ObjectId;
    @Prop({type:Number,required: true })
    quantity: number;

    
    @Prop({ type:Types.ObjectId, ref:"User", })
    createdBy?:Types.ObjectId
    @Prop({ type:Types.ObjectId, ref:"User" })
    updatedBy?:Types.ObjectId


}
@Schema({timestamps:true, strictQuery:true})
export class Cart implements ICart {
  
    
    @Prop([CartProduct])
    products: CartProduct[];
    

    
    @Prop({ type:Types.ObjectId, ref:"User", required: true , unique:true})
    createdBy:Types.ObjectId
    @Prop({ type:Types.ObjectId, ref:"User" })
    updatedBy?:Types.ObjectId


}

export type CartDocument = HydratedDocument<Cart>;
export type CartProductDocument = HydratedDocument<CartProduct>;
export const cartSchema = SchemaFactory.createForClass(Cart);
// del direct or wait some time
cartSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

// cartSchema.pre("save", async function (this: CartDocument & { wasNew: boolean; plainOtp?: string }, next) {
    

//     if (this.isModified('name')) {
//         this.slug= slugify(this.name)
//     }

//     next()
// }
// );
// cartSchema.pre(['updateOne', 'findOneAndUpdate'], async function ( next) {
    

//     const update = this.getUpdate() as UpdateQuery<CartDocument>
//     if (update.name) {
//         this.setUpdate({...update,
//             slug: slugify(update.name)
//         })
//     }

//     const query = this.getQuery();
//     if (query.paranoId=== false) {
//         this.setQuery({...query})
//     } else {
//         this.setQuery({...query, freezedAt:{$exists:false}})
//     }

//     next()
// }
// );
// cartSchema.pre(['findOne', 'find'], async function ( next) {
    
//     const query = this.getQuery();
//     if (query.paranoId=== false) {
//         this.setQuery({...query})
//     } else {
//         this.setQuery({...query, freezedAt:{$exists:false}})
//     }

//     next()
// }
// );



// export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }]);
