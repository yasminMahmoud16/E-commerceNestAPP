import { DeleteObjectCommandOutput, DeleteObjectsCommandOutput, GetObjectCommandOutput, ListObjectsV2CommandOutput, ObjectCannedACL } from "@aws-sdk/client-s3";
import { StorageEnum } from "../enums";
export declare class S3Service {
    private s3Client;
    constructor();
    uploadFile: ({ storageApproach, Bucket, ACL, path, file }: {
        storageApproach?: StorageEnum;
        Bucket?: string;
        ACL?: ObjectCannedACL;
        path?: string;
        file: Express.Multer.File;
    }) => Promise<string>;
    uploadLargeFile: ({ storageApproach, Bucket, ACL, path, file }: {
        storageApproach?: StorageEnum;
        Bucket?: string;
        ACL?: ObjectCannedACL;
        path?: string;
        file: Express.Multer.File;
    }) => Promise<string>;
    uploadFiles: ({ storageApproach, Bucket, ACL, path, files, useLarge, }: {
        storageApproach?: StorageEnum;
        Bucket?: string;
        ACL?: ObjectCannedACL;
        path?: string;
        files: Express.Multer.File[];
        useLarge?: boolean;
    }) => Promise<string[]>;
    createPreSignedUploadLink: ({ Bucket, path, ContentType, Originalname, expiresIn }: {
        Bucket?: string;
        path?: string;
        expiresIn?: number;
        ContentType: string;
        Originalname: string;
    }) => Promise<{
        url: string;
        Key: string;
    }>;
    createGetPreSignedLink: ({ Bucket, Key, expiresIn, downloadName, download }: {
        Bucket?: string;
        Key: string;
        expiresIn?: number;
        downloadName?: string;
        download?: string;
    }) => Promise<string>;
    getFile: ({ Bucket, Key }: {
        Bucket?: string;
        Key: string;
    }) => Promise<GetObjectCommandOutput>;
    deleteFile: ({ Bucket, Key }: {
        Bucket?: string;
        Key: string;
    }) => Promise<DeleteObjectCommandOutput>;
    deleteFiles: ({ Bucket, urls, Quiet }: {
        Bucket?: string;
        urls: string[];
        Quiet?: boolean;
    }) => Promise<DeleteObjectsCommandOutput>;
    listDirectoryFiles: ({ Bucket, path }: {
        Bucket?: string;
        path: string;
    }) => Promise<ListObjectsV2CommandOutput>;
    deleteFolderByPrefix: ({ Bucket, path, Quiet }: {
        Bucket?: string;
        path: string;
        Quiet?: boolean;
    }) => Promise<DeleteObjectsCommandOutput>;
}
