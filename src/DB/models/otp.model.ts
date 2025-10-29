import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { emailEvent, generateHash, OtpEnum } from "src/common";

@Schema()
export class Otp {
    @Prop({type:String, required:true})
    code: string;

    @Prop({ type:Date, required: true })
    expiredAt: Date
    
    @Prop({ type:Types.ObjectId, ref:"User", required: true })
    createdBy:Types.ObjectId


    @Prop({type:String, enum:OtpEnum, required:true})
    type:OtpEnum
}

export type OtpDocument = HydratedDocument<Otp>;
const otpSchema = SchemaFactory.createForClass(Otp);
// del direct or wait some time
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre("save", async function (this: OtpDocument & { wasNew: boolean; plainOtp?: string }, next) {
    

    this.wasNew = this.isNew;
    if (this.isModified("code")) {
        this.plainOtp = this.code
        this.code = await generateHash(this.code)
        await this.populate([
            { path: "createdBy", select: "email" }
        ])
    }
    next()
}
);

otpSchema.post("save",  function (doc, next) {
    const that = this as OtpDocument & { wasNew: boolean; plainOtp?: string }
    console.log({ email: (that.createdBy as any).email, wasNew: that.wasNew, otp: that.plainOtp });
    
    if (that.wasNew && that.plainOtp) {
        emailEvent.emit(doc.type, {
            to: (that.createdBy as any).email
            , otp: that.plainOtp
        })

    }
    next();
})


export const OtpModel = MongooseModule.forFeature([{ name: Otp.name, schema: otpSchema }]);
