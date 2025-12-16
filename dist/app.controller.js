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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const common_2 = require("./common");
const node_util_1 = require("node:util");
const node_stream_1 = require("node:stream");
const createWriteStreamPip = (0, node_util_1.promisify)(node_stream_1.pipeline);
let AppController = class AppController {
    appService;
    s3Service;
    constructor(appService, s3Service) {
        this.appService = appService;
        this.s3Service = s3Service;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getPreSignedAssetsUrl(query, params) {
        const { downloadName, download = "false", expiresIn = 120 } = query;
        const { path } = params;
        const Key = path.join('/');
        const url = await this.s3Service.createGetPreSignedLink({
            Key,
            downloadName: downloadName,
            download,
            expiresIn
        });
        return { message: "Done", data: { url } };
    }
    async getAssets(query, params, res) {
        const { downloadName, download = "false", expiresIn = 120 } = query;
        const { path } = params;
        const Key = path.join('/');
        const s3Response = await this.s3Service.getFile({ Key });
        if (!s3Response?.Body) {
            throw new common_1.BadRequestException("fail to fetch this asset");
        }
        ;
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Content-type", `${s3Response.ContentType || "application/octet-stream"}`);
        if (download === "true") {
            res.setHeader("Content-Disposition", `attachment; filename="${downloadName || Key.split("/").pop()}"`);
        }
        return await createWriteStreamPip(s3Response.Body, res);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)('/upload/pre-signed/*path'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPreSignedAssetsUrl", null);
__decorate([
    (0, common_1.Get)('/upload/*path'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAssets", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        common_2.S3Service])
], AppController);
//# sourceMappingURL=app.controller.js.map