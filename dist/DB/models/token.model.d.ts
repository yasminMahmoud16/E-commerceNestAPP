import { HydratedDocument, Types } from "mongoose";
export declare class Token {
    jti: string;
    expiredAt: Date;
    createdBy: Types.ObjectId;
}
export type TokenDocument = HydratedDocument<Token>;
export declare const tokenSchema: import("mongoose").Schema<Token, import("mongoose").Model<Token, any, any, any, import("mongoose").Document<unknown, any, Token, any, {}> & Token & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Token, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Token>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Token> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const TokenModel: import("@nestjs/common").DynamicModule;
