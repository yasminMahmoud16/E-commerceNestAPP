import { AppService } from './app.service';
import { S3Service } from './common';
import type { Response } from 'express';
export declare class AppController {
    private readonly appService;
    private readonly s3Service;
    constructor(appService: AppService, s3Service: S3Service);
    getHello(): string;
    getPreSignedAssetsUrl(query: {
        downloadName?: string;
        download?: string;
        expiresIn?: number;
    }, params: {
        path: string[];
    }): Promise<{
        message: string;
        data: {
            url: string;
        };
    }>;
    getAssets(query: {
        downloadName?: string;
        download?: string;
        expiresIn?: number;
    }, params: {
        path: string[];
    }, res: Response): Promise<void>;
}
