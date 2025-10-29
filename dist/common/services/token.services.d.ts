import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import { RoleEnum, SignatureLevelEnum, TokenEnum } from "../../common/enums";
import { LoginCredentialsResponse } from "../entities";
import { UserDocument } from "../../DB";
import { UserRepository } from "../../DB/repository";
import { TokenDocument } from "../../DB/models/token.model";
import { TokenRepository } from "src/DB/repository/token.repository";
export declare class TokenService {
    private readonly jwtService;
    private readonly userRepository;
    private readonly tokenRepository;
    constructor(jwtService: JwtService, userRepository: UserRepository, tokenRepository: TokenRepository);
    generateToken: ({ payload, options }: {
        payload: object;
        options?: JwtSignOptions;
    }) => Promise<string>;
    verifyToken: ({ token, options }: {
        token: string;
        options?: JwtVerifyOptions;
    }) => Promise<JwtPayload>;
    detectedSignature: (role?: RoleEnum) => Promise<SignatureLevelEnum>;
    getSignatures: (signatureLevel?: SignatureLevelEnum) => Promise<{
        access_signature: string;
        refresh_signature: string;
    }>;
    createLoginCredentials: (user: UserDocument) => Promise<LoginCredentialsResponse>;
    decodedToken: ({ authorization, tokenType }: {
        authorization: string;
        tokenType?: TokenEnum;
    }) => Promise<{
        user: UserDocument;
        decoded: JwtPayload;
    }>;
    createRevokeToken: (decoded: JwtPayload) => Promise<TokenDocument>;
}
