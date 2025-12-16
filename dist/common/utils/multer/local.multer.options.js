"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localFileUpload = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const localFileUpload = ({ folder = "public", validation = [], fileSize = 2 }) => {
    let basePath = `upload/${folder}`;
    return {
        storage: (0, multer_1.diskStorage)({
            destination(req, file, callback) {
                const fullPath = node_path_1.default.resolve(`./${basePath}`);
                if (!(0, node_fs_1.existsSync)(fullPath)) {
                    (0, node_fs_1.mkdirSync)(fullPath, { recursive: true });
                }
                callback(null, fullPath);
            },
            filename(req, file, callback) {
                const fileName = (0, node_crypto_1.randomUUID)() + "_" + Date.now() + "_" + file.originalname;
                file.finalPath = basePath + `/${fileName}`;
                callback(null, fileName);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (validation.includes(file.mimetype)) {
                return callback(null, true);
            }
            return callback(new common_1.BadRequestException("Invalid file formate "));
        },
        limits: {
            fileSize: fileSize * 1024 * 1024,
        }
    };
};
exports.localFileUpload = localFileUpload;
//# sourceMappingURL=local.multer.options.js.map