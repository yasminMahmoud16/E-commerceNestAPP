import { AuthenticationService } from './auth.service';
import { ConfirmEmailDto, LoginBodyDto, ResendConfirmEmailDto, SignupBodyDto } from './dto/signup.dto';
import { IResponse } from 'src/common';
import { LoginResponse } from './entities/auth.entity';
export declare class AuthenticationController {
    private readonly authService;
    constructor(authService: AuthenticationService);
    signup(body: SignupBodyDto): Promise<IResponse>;
    resendConfirmEmail(body: ResendConfirmEmailDto): Promise<IResponse>;
    confirmEmail(body: ConfirmEmailDto): Promise<IResponse>;
    login(body: LoginBodyDto): Promise<IResponse<LoginResponse>>;
}
