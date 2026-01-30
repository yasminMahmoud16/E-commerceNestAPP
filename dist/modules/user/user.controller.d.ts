import { UserService } from './user.service';
import type { IMulterFile, IResponse } from 'src/common';
import type { UserDocument } from 'src/DB';
import { profileResponse } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    profile(user: UserDocument): Promise<IResponse<profileResponse>>;
    allUsers(): {
        message: string;
    };
    profileImage(user: UserDocument, file: Express.Multer.File): Promise<IResponse<profileResponse>>;
    coverImages(files: Array<IMulterFile>): {
        message: string;
        files: IMulterFile[];
    };
    images(files: {
        profileImage?: Array<IMulterFile>;
        coverImages?: Array<IMulterFile>;
    }): {
        message: string;
        files: {
            profileImage?: Array<IMulterFile>;
            coverImages?: Array<IMulterFile>;
        };
    };
}
