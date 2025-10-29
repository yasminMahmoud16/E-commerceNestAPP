import { AuthenticationService } from './auth.service';
import { ConfirmEmailDto, LoginBodyDto, ResendConfirmEmailDto, SignupBodyDto } from './dto/signup.dto';
import { LoginResponse } from './entities/auth.entity';
export declare class AuthenticationController {
    private readonly authService;
    constructor(authService: AuthenticationService);
    signup(body: SignupBodyDto): Promise<{
        message: string;
    }>;
    resendConfirmEmail(body: ResendConfirmEmailDto): Promise<{
        message: string;
    }>;
    confirmEmail(body: ConfirmEmailDto): Promise<{
        message: string;
    }>;
    login(body: LoginBodyDto): Promise<LoginResponse>;
}
