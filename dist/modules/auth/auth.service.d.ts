import { ConfirmEmailDto, LoginBodyDto, ResendConfirmEmailDto, SignupBodyDto } from './dto/signup.dto';
import { OtpRepository, UserRepository } from 'src/DB';
import { LoginCredentialsResponse } from 'src/common';
import { TokenService } from 'src/common/services';
export declare class AuthenticationService {
    private readonly userRepository;
    private readonly otpRepository;
    private readonly tokenService;
    constructor(userRepository: UserRepository, otpRepository: OtpRepository, tokenService: TokenService);
    private createConfirmEmailOtp;
    signup(data: SignupBodyDto): Promise<string>;
    resendConfirmEmail(data: ResendConfirmEmailDto): Promise<string>;
    confirmEmail(data: ConfirmEmailDto): Promise<string>;
    login(data: LoginBodyDto): Promise<LoginCredentialsResponse>;
}
