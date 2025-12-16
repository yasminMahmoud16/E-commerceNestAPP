import {  Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { IBrand, ICategory } from "src/common";
import { IProduct } from "src/common/interfaces/product.interface";

@Schema({timestamps:true, strictQuery:true})
export class Product implements IProduct {
    @Prop({type:String, required:true,minlength:2, maxlength:2000})
    name: string;
    
    @Prop({ type: String, minlength: 2, maxlength: 50 })
    slug: string;

    @Prop({ type: String, minlength: 2, maxlength: 50000 })
    description: string;

    @Prop({type:String})
    image: string;

    @Prop({type:[String],})
    images: string[];

    @Prop({ type: Number, required: true })
    mainPrice: number;
    @Prop({ type: Number, })
    salePrice: number;
    @Prop({ type: Number, default:0 })
    discount: number;
    @Prop({ type: Number, default:0 })
    soldItems: number;
    @Prop({ type: Number, required: true })
    stock: number;



    
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId;
    
    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy?: Types.ObjectId;
    

    @Prop([{ type: Types.ObjectId, ref: "Brand", required: true }])
    brands: Types.ObjectId;
    @Prop([{ type: Types.ObjectId, ref: "Category", required: true }])
    category: Types.ObjectId;
    
    @Prop({ type: String,required:true})
    assetFolderId: string;

    @Prop({type:Date})
    freezedAt?: Date;

    @Prop({type:Date})
    restoredAt?: Date;
}

export type ProductDocument = HydratedDocument<Product>;
export const productSchema = SchemaFactory.createForClass(Product);
// del direct or wait some time
productSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

productSchema.pre("save", async function (this: ProductDocument & { wasNew: boolean; plainOtp?: string }, next) {
    

    if (this.isModified('name')) {
        this.slug= slugify(this.name)
    }

   
    next()
}
);
productSchema.pre(['updateOne', 'findOneAndUpdate'], async function ( next) {
    

    const update = this.getUpdate() as UpdateQuery<ProductDocument>
    if (update.name) {
        this.setUpdate({...update,
            slug: slugify(update.name)
        })
    }

    const query = this.getQuery();
    if (query.paranoId=== false) {
        this.setQuery({...query})
    } else {
        this.setQuery({...query, freezedAt:{$exists:false}})
    }

    next()
}
);
productSchema.pre(['findOne', 'find'], async function ( next) {
    
    const query = this.getQuery();
    if (query.paranoId=== false) {
        this.setQuery({...query})
    } else {
        this.setQuery({...query, freezedAt:{$exists:false}})
    }

    next()
}
);



// export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }]);
