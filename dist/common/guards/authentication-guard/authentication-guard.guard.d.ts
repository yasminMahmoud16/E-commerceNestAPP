import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/common/services';
export declare class AuthenticationGuard implements CanActivate {
    private readonly tokenService;
    private readonly reflector;
    constructor(tokenService: TokenService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
