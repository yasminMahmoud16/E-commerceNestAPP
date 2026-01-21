import { Injectable } from "@nestjs/common";
import { AdminAndResourceOptions, v2 as cloudinary } from "cloudinary";
import { StorageEnum } from "../enums";
import type { IAttachment } from "../interfaces";

@Injectable()
export class CloudService {
    constructor() { 
        cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET,
                secure: true,
            })
    }
    uploadFile = async ({
        storageApproach = StorageEnum.memory,
        path = "general",
        file
    }: {
        storageApproach?: StorageEnum;
        path?: string;
            file: Express.Multer.File;
        
    }) => {
        return await cloudinary.uploader.upload(file.path,
            {
                folder: `${process.env.APPLICATION_NAME}/${path}`,
                timeout: 120000
        }
        
        );
        // return cloud.secure_url;
    };

        uploadFiles = async ({
            storageApproach = StorageEnum.memory,
            path = "general",
            files,
        }: {
            storageApproach?: StorageEnum;
            path?: string;
            files: Express.Multer.File[];
        }): Promise<IAttachment[]> => {
            let urls: IAttachment[] = [];
    
            for (const file of files) {
                const {secure_url, public_id }=await cloudinary.uploader.upload(file.path,
                    {
                        folder: `${process.env.APPLICATION_NAME}/${path}`
                    }

                );
                urls.push({secure_url, public_id});
            }
    
            // if (useLarge) {
            //     urls = await Promise.all(
            //         files.map((file) => {
            //             return this.uploadLargeFile({
    
            //                 file,
            //                 path,
            //                 storageApproach
            //             });
            //         })
            //     )
            // } else {
            //     // start all in one time 
            //     urls = await Promise.all(
            //         files.map((file) => {
            //             return this.uploadFile({
    
            //                 file,
            //                 path,
            //                 storageApproach
            //             });
            //         })
            //     )
            // }
    
            // one after one
            // for (const file of files) {
    
            //     const key = await uploadFile({
    
            //         file,
            //         ACL,
            //         path,
            //         Bucket,
            //         storageApproach
            //     });
            //     urls.push(key);
            // };
            return urls;
    };
    
    deleteFile = async (
        file: { public_id: string }
    ): Promise<string> => {
        return await cloudinary.uploader.destroy(file.public_id);
    };
    deleteFiles = async (public_ids:string[], options?:AdminAndResourceOptions): Promise<void> => {
      
        return await cloudinary.api.delete_resources(public_ids, options|| {
            type: 'upload',
            resource_type: 'image',
        });
    };
    deleteFolderAssets = async (path:string): Promise<void> => {
      
        return await cloudinary.api.delete_resources_by_prefix(path);
    };
    
}
// export default () => {
//     cloudinary.config({
//         cloud_name: process.env.CLOUD_NAME,
//         api_key: process.env.API_KEY,
//         api_secret: process.env.API_SECRET,
//         secure: true,
//     })
//     return cloudinary;
// }