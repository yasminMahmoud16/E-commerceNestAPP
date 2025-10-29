import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tokenName } from 'src/common/decorators';
import { roleName } from 'src/common/decorators/role.decorator';
import { RoleEnum, TokenEnum } from 'src/common/enums';
import { TokenService } from 'src/common/services';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,

  ) { }
  canActivate(
    context: ExecutionContext): boolean  {

    const accessRoles: RoleEnum[] =
      this.reflector.getAllAndOverride<RoleEnum[]>(roleName, [
        // for route
        context.getHandler(),
        // for class
        context.getClass()
      ]) ?? [];






    // console.log({context});
      let role:RoleEnum=RoleEnum.user
    switch (context.getType()) {
      case 'http':
        role = context.switchToHttp().getRequest().credentials.user.role
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

    // console.log({accessRoles, role});
    


    return accessRoles.includes(role);
  }
}
