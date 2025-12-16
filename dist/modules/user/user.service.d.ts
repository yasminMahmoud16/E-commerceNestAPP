import { S3Service } from 'src/common';
import { UserDocument } from 'src/DB';
export declare class UserService {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    allUsers(): string;
    profileImage(file: Express.Multer.File, user: UserDocument): Promise<UserDocument>;
}
