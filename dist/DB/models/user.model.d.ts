import { HydratedDocument } from "mongoose";
import { GenderEnum, LanguageEnum, ProviderEnum, RoleEnum } from "src/common";
import { OtpDocument } from "./otp.model";
export declare class User {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    confirmedAt: Date;
    password: string;
    provider: ProviderEnum;
    role: RoleEnum;
    gender: GenderEnum;
    preferredLanguage: LanguageEnum;
    changeCredentialsTime: Date;
    otp: OtpDocument[];
}
export type UserDocument = HydratedDocument<User>;
export declare const userSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const UserModel: import("@nestjs/common").DynamicModule;
