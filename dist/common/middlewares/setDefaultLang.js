"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDefaultLang = void 0;
const setDefaultLang = (req, res, next) => {
    console.log("default language .....");
    req.headers['accept-language'] = req.headers['accept-language'] ?? 'EN';
    next();
};
exports.setDefaultLang = setDefaultLang;
//# sourceMappingURL=setDefaultLang.js.map