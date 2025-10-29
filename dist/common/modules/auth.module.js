"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedAuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const models_1 = require("../../DB/models");
const repository_1 = require("../../DB/repository");
const jwt_1 = require("@nestjs/jwt");
const token_services_1 = require("../../common/services/token.services");
let SharedAuthenticationModule = class SharedAuthenticationModule {
};
exports.SharedAuthenticationModule = SharedAuthenticationModule;
exports.SharedAuthenticationModule = SharedAuthenticationModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [models_1.UserModel, models_1.TokenModel],
        controllers: [],
        providers: [
            repository_1.UserRepository,
            jwt_1.JwtService,
            repository_1.TokenRepository,
            token_services_1.TokenService,
        ],
        exports: [
            repository_1.UserRepository,
            jwt_1.JwtService,
            repository_1.TokenRepository,
            token_services_1.TokenService,
            models_1.UserModel,
            models_1.TokenModel
        ],
    })
], SharedAuthenticationModule);
//# sourceMappingURL=auth.module.js.map