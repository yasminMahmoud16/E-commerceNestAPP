import {
    IsEmail, IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length,
    Matches,
    ValidateIf,

 } from "class-validator";
import { GenderEnum, IsMatch } from "src/common";
export class ResendConfirmEmailDto{
    @IsEmail()
    email: string;
}
export class ConfirmEmailDto extends ResendConfirmEmailDto {
    @Matches(/^\d{6}$/)
    code:string
}
export class LoginBodyDto extends ResendConfirmEmailDto {

    // @IsMatch(['email'])
    // CEmail: string;
    @IsStrongPassword()
    password: string;
}


export class SignupBodyDto extends LoginBodyDto {

    @Length(2,52,{message:"username min length is 2 char and max length is 52 char"})
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    username: string;


    @ValidateIf((data: SignupBodyDto)=> {
        return Boolean(data.password)
    })
    @IsMatch<string>(['password'],
        // { message: "confirmPassword not identical with password" }
    )
    confirmPassword: string;

    @IsEnum(GenderEnum)

    gender:GenderEnum
}



