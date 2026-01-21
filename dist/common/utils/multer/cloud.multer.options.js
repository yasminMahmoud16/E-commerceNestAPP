"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudFileUpload = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
const enums_1 = require("../../enums");
const cloudFileUpload = ({ storageApproach = enums_1.StorageEnum.memory, validation = [], fileSize = 10 }) => {
    return {
        storage: storageApproach === enums_1.StorageEnum.memory ? (0, multer_1.memoryStorage)() : (0, multer_1.diskStorage)({}),
        fileFilter: (req, file, callback) => {
            if (validation.includes(file.mimetype)) {
                return callback(null, true);
            }
            return callback(new common_1.BadRequestException("Invalid file formate "), false);
        },
        limits: {
            fileSize: fileSize * 1024 * 1024,
        }
    };
};
exports.cloudFileUpload = cloudFileUpload;
//# sourceMappingURL=cloud.multer.options.js.map