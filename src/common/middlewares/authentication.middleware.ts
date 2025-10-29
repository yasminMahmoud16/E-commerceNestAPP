
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import  {Request, Response, NextFunction } from 'express';


// function middleware to detected the token access/ refresh
// validation key validate 
export const PreAuth = async (req: Request, res: Response, next: NextFunction)=> {

        if (!(req.headers.authorization?.split(" ")?.length == 2)) {
            throw new BadRequestException("Missing authorization key");
        }

        next();
    }


// service middleware:::
// @Injectable()
// export class AuthenticationMiddleware implements NestMiddleware { 
//     constructor(private readonly tokenService: TokenService){}
//     async use(req: IAuthRequest, res: Response, next: NextFunction) { 
//         console.log(req.headers.authorization);
//         const { user, decoded } = await this.tokenService.decodedToken({
//             authorization: req.headers.authorization?? "",
//             tokenType:req.tokenType as TokenEnum
//         })

//         req.credentials = { user, decoded }
//         next();
//     }
// }

// export class AuthenticationMiddleware implements NestMiddleware {
//     constructor(private readonly tokenService: TokenService) { }
//     async use(req: Request, res: Response, next: NextFunction) {
//         console.log('Request...');
//         console.log(req.headers.authorization);

//         // const { user, decoded } = await this.tokenService.decodedToken({
//         //     authorization: req.headers.authorization ?? "",
//         //     tokenType: TokenEnum.access,
//         // })

//         // req.credentials ={ user, decoded };
//         next();
//     }
// }
