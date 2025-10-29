"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.roleName = void 0;
const common_1 = require("@nestjs/common");
exports.roleName = "roles";
const Roles = (accessRoles) => {
    return (0, common_1.SetMetadata)(exports.roleName, accessRoles);
};
exports.Roles = Roles;
//# sourceMappingURL=role.decorator.js.map