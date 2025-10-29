import { GenderEnum } from "src/common";
export declare class ResendConfirmEmailDto {
    email: string;
}
export declare class ConfirmEmailDto extends ResendConfirmEmailDto {
    code: string;
}
export declare class LoginBodyDto extends ResendConfirmEmailDto {
    password: string;
}
export declare class SignupBodyDto extends LoginBodyDto {
    username: string;
    confirmPassword: string;
    gender: GenderEnum;
}
