import { HydratedDocument, Types } from "mongoose";
import { IOtp, OtpEnum } from "src/common";
export declare class Otp implements IOtp {
    code: string;
    expiredAt: Date;
    createdBy: Types.ObjectId;
    type: OtpEnum;
}
export type OtpDocument = HydratedDocument<Otp>;
export declare const OtpModel: import("@nestjs/common").DynamicModule;
