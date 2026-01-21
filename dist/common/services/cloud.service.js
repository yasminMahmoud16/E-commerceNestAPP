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
exports.CloudService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const enums_1 = require("../enums");
let CloudService = class CloudService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
            secure: true,
        });
    }
    uploadFile = async ({ storageApproach = enums_1.StorageEnum.memory, path = "general", file }) => {
        return await cloudinary_1.v2.uploader.upload(file.path, {
            folder: `${process.env.APPLICATION_NAME}/${path}`,
            timeout: 120000
        });
    };
    uploadFiles = async ({ storageApproach = enums_1.StorageEnum.memory, path = "general", files, }) => {
        let urls = [];
        for (const file of files) {
            const { secure_url, public_id } = await cloudinary_1.v2.uploader.upload(file.path, {
                folder: `${process.env.APPLICATION_NAME}/${path}`
            });
            urls.push({ secure_url, public_id });
        }
        return urls;
    };
    deleteFile = async (file) => {
        return await cloudinary_1.v2.uploader.destroy(file.public_id);
    };
    deleteFiles = async (public_ids, options) => {
        return await cloudinary_1.v2.api.delete_resources(public_ids, options || {
            type: 'upload',
            resource_type: 'image',
        });
    };
    deleteFolderAssets = async (path) => {
        return await cloudinary_1.v2.api.delete_resources_by_prefix(path);
    };
};
exports.CloudService = CloudService;
exports.CloudService = CloudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudService);
//# sourceMappingURL=cloud.service.js.map