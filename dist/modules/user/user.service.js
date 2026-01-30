"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../common");
const DB_1 = require("../../DB");
let UserService = class UserService {
    s3Service;
    userRepository;
    constructor(s3Service, userRepository) {
        this.s3Service = s3Service;
        this.userRepository = userRepository;
    }
    allUsers() {
        return 'users';
    }
    ;
    async profileImage(file, user) {
        user.profilePicture = await this.s3Service.uploadFile({
            file,
            storageApproach: common_2.StorageEnum.disk,
            path: `user/${user._id.toString()}`
        });
        await user.save();
        return user;
    }
    async profile(user) {
        const profile = await this.userRepository.findOne({
            filter: {
                _id: user._id
            },
            options: {
                populate: [
                    {
                        path: "wishlist"
                    }
                ]
            }
        });
        if (!profile) {
            throw new common_1.NotFoundException("Faild to find matching user");
        }
        return profile;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [common_2.S3Service,
        DB_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map