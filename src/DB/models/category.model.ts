import {  Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument, Types, UpdateQuery } from "mongoose";
import slugify from "slugify";
import { ICategory } from "src/common";

@Schema({timestamps:true, strictQuery:true})
export class Category implements ICategory {
    @Prop({type:String, required:true, unique:true , minlength:2, maxlength:25})
    name: string;
    
    @Prop({ type: String, minlength: 2, maxlength: 50 })
    slug: string;

    @Prop({ type: String, minlength: 2, maxlength: 5000 })
    description: string;

    @Prop({type:String, required:true})
    image: string;


    
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId;
    
    @Prop({ type: Types.ObjectId, ref: "User" })
    updatedBy?: Types.ObjectId;
    

    @Prop([{ type: Types.ObjectId, ref: "Brand", }])
    brands?: Types.ObjectId[];
    
    @Prop({ type: String,required:true})
    assetFolderId: string;

    @Prop({type:Date})
    freezedAt?: Date;

    @Prop({type:Date})
    restoredAt?: Date;
}

export type CategoryDocument = HydratedDocument<Category>;
export const categorySchema = SchemaFactory.createForClass(Category);
// del direct or wait some time
categorySchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

categorySchema.pre("save", async function (this: CategoryDocument & { wasNew: boolean; plainOtp?: string }, next) {
    

    if (this.isModified('name')) {
        this.slug= slugify(this.name)
    }

    next()
}
);
categorySchema.pre(['updateOne', 'findOneAndUpdate'], async function ( next) {
    

    const update = this.getUpdate() as UpdateQuery<CategoryDocument>
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
categorySchema.pre(['findOne', 'find'], async function ( next) {
    
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
