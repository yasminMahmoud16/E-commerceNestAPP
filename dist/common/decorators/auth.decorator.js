"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
const token_decorator_1 = require("./token.decorator");
const role_decorator_1 = require("./role.decorator");
const authentication_guard_guard_1 = require("../guards/authentication-guard/authentication-guard.guard");
const authorization_guard_guard_1 = require("../guards/authorization-guard/authorization-guard.guard");
function Auth(roles, type = enums_1.TokenEnum.access) {
    return (0, common_1.applyDecorators)((0, token_decorator_1.Token)(type), (0, role_decorator_1.Roles)(roles), (0, common_1.UseGuards)(authentication_guard_guard_1.AuthenticationGuard, authorization_guard_guard_1.AuthorizationGuard));
}
//# sourceMappingURL=auth.decorator.js.map