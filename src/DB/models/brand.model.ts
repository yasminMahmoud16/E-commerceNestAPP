import {  Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import type{ IAttachment, IBrand } from "src/common";

@Schema({timestamps:true, strictQuery:true})
export class Brand implements IBrand {
    @Prop({type:String, required:true, unique:true , minlength:2, maxlength:25})
    name: string;
    @Prop({ type: String, minlength: 2, maxlength: 50 })
    slug: string;
    @Prop({ type: String, required: true, minlength: 2, maxlength: 25 })
    slogan: string;
    // @Prop({type:String, required:true})
    // image: string;
    @Prop(raw({
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        }))
        image: IAttachment;


    
    @Prop({ type:Types.ObjectId, ref:"User", required: true })
    createdBy:Types.ObjectId
    @Prop({ type:Types.ObjectId, ref:"User" })
    updatedBy?:Types.ObjectId


    @Prop({type:Date})
    freezedAt?: Date;

    @Prop({type:Date})
    restoredAt?: Date;
}

export type BrandDocument = HydratedDocument<Brand>;
export const brandSchema = SchemaFactory.createForClass(Brand);
// del direct or wait some time
brandSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

brandSchema.pre("save", async function (this: BrandDocument & { wasNew: boolean; plainOtp?: string }, next) {
    

    if (this.isModified('name')) {
        this.slug= slugify(this.name)
    }

    next()
}
);
brandSchema.pre(['updateOne', 'findOneAndUpdate'], async function ( next) {
    

    const update = this.getUpdate() as UpdateQuery<BrandDocument>
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
brandSchema.pre(['findOne', 'find'], async function ( next) {
    
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
