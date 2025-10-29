"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const enums_1 = require("../../common/enums");
const crypto_1 = require("crypto");
const ObjectId_1 = require("../utils/ObjectId");
const repository_1 = require("../../DB/repository");
const token_repository_1 = require("../../DB/repository/token.repository");
let TokenService = class TokenService {
    jwtService;
    userRepository;
    tokenRepository;
    constructor(jwtService, userRepository, tokenRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        console.log('✅ TokenService constructor called');
    }
    generateToken = async ({ payload, options = {
        secret: process.env.ACCESS_USER_TOKEN_SIGNATURE,
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN)
    } }) => {
        return await this.jwtService.signAsync(payload, options);
    };
    verifyToken = async ({ token, options = {
        secret: process.env.ACCESS_USER_TOKEN_SIGNATURE,
    } }) => {
        return await this.jwtService.verifyAsync(token, options);
    };
    detectedSignature = async (role = enums_1.RoleEnum.user) => {
        let signatureLevel = enums_1.SignatureLevelEnum.Bearer;
        switch (role) {
            case enums_1.RoleEnum.admin:
            case enums_1.RoleEnum.superAdmin:
                signatureLevel = enums_1.SignatureLevelEnum.System;
                break;
            default:
                signatureLevel = enums_1.SignatureLevelEnum.Bearer;
                break;
        }
        return signatureLevel;
    };
    getSignatures = async (signatureLevel = enums_1.SignatureLevelEnum.Bearer) => {
        let signatures = {
            access_signature: "",
            refresh_signature: ""
        };
        switch (signatureLevel) {
            case enums_1.SignatureLevelEnum.System:
                signatures.access_signature = process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE;
                signatures.refresh_signature = process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE;
                break;
            default:
                signatures.access_signature = process.env.ACCESS_USER_TOKEN_SIGNATURE;
                signatures.refresh_signature = process.env.REFRESH_USER_TOKEN_SIGNATURE;
                break;
        }
        return signatures;
    };
    createLoginCredentials = async (user) => {
        const signaturesLevel = await this.detectedSignature(user.role);
        const signatures = await this.getSignatures(signaturesLevel);
        const jwtid = (0, crypto_1.randomUUID)();
        const access_token = await this.generateToken({
            payload: {
                _id: user._id,
            },
            options: {
                expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
                secret: signatures.access_signature,
                jwtid
            }
        });
        const refresh_token = await this.generateToken({
            payload: {
                _id: user._id,
            },
            options: {
                secret: signatures.refresh_signature,
                expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
                jwtid
            }
        });
        return { access_token, refresh_token };
    };
    decodedToken = async ({ authorization, tokenType = enums_1.TokenEnum.access }) => {
        try {
            const [bearerKey, token] = authorization.split(" ");
            if (!bearerKey || !token) {
                throw new common_1.UnauthorizedException(" Missing token parts");
            }
            const signatures = await this.getSignatures(bearerKey);
            const decoded = await this.verifyToken({
                token,
                options: {
                    secret: tokenType === enums_1.TokenEnum.refresh
                        ?
                            signatures.refresh_signature
                        :
                            signatures.access_signature
                }
            });
            if (!(decoded?.sub || decoded?._id) || !decoded?.iat) {
                throw new common_1.BadRequestException("in-valid token payload");
            }
            ;
            if (await this.tokenRepository.findOne({
                filter: {
                    jti: decoded.jti,
                }
            })) {
                throw new common_1.UnauthorizedException("In-valid or old login credentials");
            }
            ;
            const user = await this.userRepository.findOne({
                filter: {
                    _id: decoded._id,
                }
            });
            if (!user) {
                throw new common_1.BadRequestException("Not register account");
            }
            ;
            if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
                throw new common_1.UnauthorizedException("In-valid or old login credentials");
            }
            return { user, decoded };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error.message || "something went wrong");
        }
    };
    createRevokeToken = async (decoded) => {
        const [result] = await this.tokenRepository.create({
            data: [{
                    jti: decoded?.jti,
                    expiredAt: new Date(decoded?.iat + Number(process.env.REFRESH_TOKEN_EXPIRES_IN)),
                    createdBy: (0, ObjectId_1.parseObjectId)(decoded.sub),
                }]
        }) || [];
        if (!result) {
            throw new common_1.BadRequestException("Fail to revoke this token");
        }
        ;
        return result;
    };
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        repository_1.UserRepository,
        token_repository_1.TokenRepository])
], TokenService);
//# sourceMappingURL=token.services.js.map