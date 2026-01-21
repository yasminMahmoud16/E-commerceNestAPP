import { AdminAndResourceOptions } from "cloudinary";
import { StorageEnum } from "../enums";
import type { IAttachment } from "../interfaces";
export declare class CloudService {
    constructor();
    uploadFile: ({ storageApproach, path, file }: {
        storageApproach?: StorageEnum;
        path?: string;
        file: Express.Multer.File;
    }) => Promise<import("cloudinary").UploadApiResponse>;
    uploadFiles: ({ storageApproach, path, files, }: {
        storageApproach?: StorageEnum;
        path?: string;
        files: Express.Multer.File[];
    }) => Promise<IAttachment[]>;
    deleteFile: (file: {
        public_id: string;
    }) => Promise<string>;
    deleteFiles: (public_ids: string[], options?: AdminAndResourceOptions) => Promise<void>;
    deleteFolderAssets: (path: string) => Promise<void>;
}
