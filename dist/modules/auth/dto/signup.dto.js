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
exports.SignupBodyDto = exports.LoginBodyDto = exports.ConfirmEmailDto = exports.ResendConfirmEmailDto = void 0;
const class_validator_1 = require("class-validator");
const common_1 = require("../../../common");
class ResendConfirmEmailDto {
    email;
}
exports.ResendConfirmEmailDto = ResendConfirmEmailDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResendConfirmEmailDto.prototype, "email", void 0);
class ConfirmEmailDto extends ResendConfirmEmailDto {
    code;
}
exports.ConfirmEmailDto = ConfirmEmailDto;
__decorate([
    (0, class_validator_1.Matches)(/^\d{6}$/),
    __metadata("design:type", String)
], ConfirmEmailDto.prototype, "code", void 0);
class LoginBodyDto extends ResendConfirmEmailDto {
    password;
}
exports.LoginBodyDto = LoginBodyDto;
__decorate([
    (0, class_validator_1.IsStrongPassword)(),
    __metadata("design:type", String)
], LoginBodyDto.prototype, "password", void 0);
class SignupBodyDto extends LoginBodyDto {
    username;
    confirmPassword;
    gender;
}
exports.SignupBodyDto = SignupBodyDto;
__decorate([
    (0, class_validator_1.Length)(2, 52, { message: "username min length is 2 char and max length is 52 char" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SignupBodyDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((data) => {
        return Boolean(data.password);
    }),
    (0, common_1.IsMatch)(['password']),
    __metadata("design:type", String)
], SignupBodyDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(common_1.GenderEnum),
    __metadata("design:type", String)
], SignupBodyDto.prototype, "gender", void 0);
//# sourceMappingURL=signup.dto.js.map