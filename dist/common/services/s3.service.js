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
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3Service = class S3Service {
    s3Client;
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            }
        });
    }
    uploadFile = async ({ storageApproach = enums_1.StorageEnum.memory, Bucket = process.env.AWS_BUcKET_NAME, ACL = "private", path = "general", file }) => {
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            ACL,
            Key: `${process.env.APPLICATION_NAME}/${path}/${(0, crypto_1.randomUUID)()}_${file.originalname}`,
            Body: storageApproach === enums_1.StorageEnum.memory ? file.buffer : (0, fs_1.createReadStream)(file.path),
            ContentType: file.mimetype
        });
        await this.s3Client.send(command);
        if (!command?.input.Key) {
            throw new common_1.BadRequestException("failed to generate upload key ");
        }
        return command.input.Key;
    };
    uploadLargeFile = async ({ storageApproach = enums_1.StorageEnum.disk, Bucket = process.env.AWS_BUcKET_NAME, ACL = "private", path = "general", file }) => {
        const upload = new lib_storage_1.Upload({
            client: this.s3Client,
            params: {
                Bucket,
                ACL,
                Key: `${process.env.APPLICATION_NAME}/${path}/${(0, crypto_1.randomUUID)()}_${file.originalname}`,
                Body: storageApproach === enums_1.StorageEnum.memory ? file.buffer : (0, fs_1.createReadStream)(file.path),
                ContentType: file.mimetype
            }
        });
        upload.on("httpUploadProgress", (progress) => {
            console.log(`upload file progress is :::::`, progress);
        });
        const { Key } = await upload.done();
        if (!Key) {
            throw new common_1.BadRequestException("failed to generate upload key ");
        }
        return Key;
    };
    uploadFiles = async ({ storageApproach = enums_1.StorageEnum.memory, Bucket = process.env.AWS_BUcKET_NAME, ACL = "private", path = "general", files, useLarge = false, }) => {
        let urls = [];
        if (useLarge) {
            urls = await Promise.all(files.map((file) => {
                return this.uploadLargeFile({
                    file,
                    ACL,
                    path,
                    Bucket,
                    storageApproach
                });
            }));
        }
        else {
            urls = await Promise.all(files.map((file) => {
                return this.uploadFile({
                    file,
                    ACL,
                    path,
                    Bucket,
                    storageApproach
                });
            }));
        }
        return urls;
    };
    createPreSignedUploadLink = async ({ Bucket = process.env.AWS_BUcKET_NAME, path = "general", ContentType, Originalname, expiresIn = Number(process.env.AWS_PRE_SIGNED_URL_EXPIRES_IN_SECOND) }) => {
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            Key: `${process.env.APPLICATION_NAME}/${path}/${(0, crypto_1.randomUUID)()}_pre_${Originalname}`,
            ContentType
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        if (!url || !command.input.Key) {
            throw new common_1.BadRequestException("Failed to create pre signed url");
        }
        return { url, Key: command.input.Key };
    };
    createGetPreSignedLink = async ({ Bucket = process.env.AWS_BUcKET_NAME, Key, expiresIn = Number(process.env.AWS_PRE_SIGNED_URL_EXPIRES_IN_SECOND), downloadName = "dummy", download = "false" }) => {
        const command = new client_s3_1.GetObjectCommand({
            Bucket,
            Key,
            ResponseContentDisposition: download === "true" ?
                `attachment; filename="${downloadName || Key.split("/").pop()}"` : undefined,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        if (!url) {
            throw new common_1.BadRequestException("Failed to create pre signed url");
        }
        return url;
    };
    getFile = async ({ Bucket = process.env.AWS_BUcKET_NAME, Key }) => {
        const command = new client_s3_1.GetObjectCommand({
            Bucket,
            Key
        });
        return await this.s3Client.send(command);
    };
    deleteFile = async ({ Bucket = process.env.AWS_BUcKET_NAME, Key }) => {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket,
            Key
        });
        return await this.s3Client.send(command);
    };
    deleteFiles = async ({ Bucket = process.env.AWS_BUcKET_NAME, urls, Quiet = false }) => {
        const Objects = urls.map((url) => {
            return { Key: url };
        });
        console.log(Objects);
        const command = new client_s3_1.DeleteObjectsCommand({
            Bucket,
            Delete: {
                Objects,
                Quiet
            }
        });
        return await this.s3Client.send(command);
    };
    listDirectoryFiles = async ({ Bucket = process.env.AWS_BUcKET_NAME, path }) => {
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket,
            Prefix: `${process.env.APPLICATION_NAME}/${path}`
        });
        return await this.s3Client.send(command);
    };
    deleteFolderByPrefix = async ({ Bucket = process.env.AWS_BUcKET_NAME, path, Quiet = false }) => {
        const fileList = await this.listDirectoryFiles({ Bucket, path });
        if (!fileList.Contents?.length) {
            throw new common_1.BadRequestException("empty directory");
        }
        const urls = fileList.Contents.map((file) => { return file.Key; });
        return await this.deleteFiles({ urls, Bucket, Quiet });
    };
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
//# sourceMappingURL=s3.service.js.map