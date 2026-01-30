import { S3Service } from 'src/common';
import { UserDocument, UserRepository } from 'src/DB';
export declare class UserService {
    private readonly s3Service;
    private readonly userRepository;
    constructor(s3Service: S3Service, userRepository: UserRepository);
    allUsers(): string;
    profileImage(file: Express.Multer.File, user: UserDocument): Promise<UserDocument>;
    profile(user: UserDocument): Promise<UserDocument>;
}
