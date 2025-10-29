import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tokenName } from 'src/common/decorators';
import { TokenEnum } from 'src/common/enums';
import { TokenService } from 'src/common/services';

// guard -> return boolean / single responsibility 
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
    
  ){}
  async canActivate(
    context: ExecutionContext,
    
  ): Promise<boolean> {
    const tokenType: TokenEnum = this.reflector.getAllAndOverride(tokenName, [
      // for route
      // context.getHandler()
      // for class
      context.getClass()
    ])?? TokenEnum.access;
    console.log({tokenType});
    






    // console.log({context});
    let req: any;
    let authorization: string = "";
    switch (context.getType()) {
      case 'http':
        const httpCtx = context.switchToHttp();  
        req = httpCtx.getRequest();
        authorization = req.headers.authorization;

        break;
    
      // case 'rpc':
      //   const RPCtx = context.switchToRpc();    
      //   break;
      // case 'ws':
      //   const WSCtx = context.switchToWs();    
      //   break;
    
      default:
        break;
    }

    const { decoded, user } = await this.tokenService.decodedToken({
      authorization,
      tokenType,
    });
    req.credentials={ decoded, user }
    return true;
  }
}
