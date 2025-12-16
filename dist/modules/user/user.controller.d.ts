import { UserService } from './user.service';
import type { IMulterFile, IResponse } from 'src/common';
import type { UserDocument } from 'src/DB';
import { Observable } from 'rxjs';
import { profileResponse } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    profile(header: any, user: UserDocument): Observable<any>;
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
