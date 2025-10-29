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
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const DB_1 = require("../../DB");
const common_2 = require("../../common");
const services_1 = require("../../common/services");
let AuthenticationService = class AuthenticationService {
    userRepository;
    otpRepository;
    tokenService;
    constructor(userRepository, otpRepository, tokenService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.tokenService = tokenService;
    }
    async createConfirmEmailOtp(userId) {
        await this.otpRepository.create({
            data: [{
                    code: (0, common_2.createNumericalOtp)(),
                    expiredAt: new Date(Date.now() + 2 * 60 * 1000),
                    createdBy: userId,
                    type: common_2.OtpEnum.ConfirmEmail
                }]
        });
    }
    async signup(data) {
        const { email, password, username, gender } = data;
        const checkUserExist = await this.userRepository.findOne({ filter: { email } });
        if (checkUserExist) {
            throw new common_1.ConflictException("Email already exist");
        }
        ;
        const [user] = await this.userRepository.create({
            data: [
                { username, email, password: await (0, common_2.generateHash)(password), gender }
            ]
        });
        if (!user) {
            throw new common_1.BadRequestException("Failed to signup please try again later");
        }
        ;
        await this.createConfirmEmailOtp(user._id);
        return "Done";
    }
    async resendConfirmEmail(data) {
        const { email } = data;
        const user = await this.userRepository.findOne({
            filter: { email, confirmedAt: { $exists: false } },
            options: {
                populate: [{
                        path: "otp",
                        match: {
                            type: common_2.OtpEnum.ConfirmEmail
                        }
                    }]
            }
        });
        console.log({ user });
        if (!user) {
            throw new common_1.NotFoundException("Failed to find matching account");
        }
        ;
        if (user.otp?.length) {
            throw new common_1.ConflictException(`Sorry we can not grand new otp until the existing one become expired please try again after${user.otp[0].expiredAt.toLocaleString()}`);
        }
        await this.createConfirmEmailOtp(user._id);
        return "Done";
    }
    async confirmEmail(data) {
        const { email, code } = data;
        const user = await this.userRepository.findOne({
            filter: { email, confirmedAt: { $exists: false } },
            options: {
                populate: [{
                        path: "otp",
                        match: {
                            type: common_2.OtpEnum.ConfirmEmail
                        }
                    }]
            }
        });
        console.log({ user });
        if (!user) {
            throw new common_1.NotFoundException("Failed to find matching account");
        }
        ;
        if (!(user.otp?.length && await (0, common_2.compareHash)(code, user.otp[0].code))) {
            throw new common_1.BadRequestException("In-valid otp");
        }
        ;
        user.confirmedAt = new Date();
        await user.save();
        await this.otpRepository.deleteOne({ filter: { _id: user.otp[0]._id } });
        return "Done";
    }
    async login(data) {
        const { email, password } = data;
        const user = await this.userRepository.findOne({
            filter: {
                email,
                confirmedAt: { $exists: true },
                provider: common_2.ProviderEnum.SYSTEM
            }
        });
        console.log({ user });
        if (!user) {
            throw new common_1.NotFoundException("Failed to find matching account");
        }
        ;
        if (!(await (0, common_2.compareHash)(password, user.password))) {
            throw new common_1.NotFoundException("Failed to find matching account compare");
        }
        ;
        return await this.tokenService.createLoginCredentials(user);
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DB_1.UserRepository,
        DB_1.OtpRepository,
        services_1.TokenService])
], AuthenticationService);
//# sourceMappingURL=auth.service.js.map