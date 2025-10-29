import { NextFunction, Request, Response } from "express";
import { TokenEnum } from "../enums";

// function middleware:::
export const setDefaultLang = (req: Request, res: Response, next:NextFunction)=>{
    console.log("default language .....");
    req.headers['accept-language'] = req.headers['accept-language'] ?? 'EN';
    next();
}
// export const authenticationMiddleware = (tokenType:TokenEnum) => {
//     return (req: Request, res: Response, next: NextFunction) => {

//         console.log(tokenType);
        
//         next();
//     }
// }