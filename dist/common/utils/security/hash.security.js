"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.generateHash = void 0;
const bcrypt_1 = require("bcrypt");
const generateHash = async (plainText, salt_round = parseInt(process.env.SALT)) => {
    return await (0, bcrypt_1.hash)(plainText, salt_round);
};
exports.generateHash = generateHash;
const compareHash = async (plainText, hashValue) => {
    return await (0, bcrypt_1.compare)(plainText, hashValue);
};
exports.compareHash = compareHash;
//# sourceMappingURL=hash.security.js.map