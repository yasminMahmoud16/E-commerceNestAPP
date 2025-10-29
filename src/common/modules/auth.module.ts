import { Global, Module } from '@nestjs/common';
import {  TokenModel, UserModel } from '../../DB/models';
import { OtpRepository, TokenRepository, UserRepository } from '../../DB/repository';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../common/services/token.services';
@Global()
@Module({
  //import from outside
  imports: [UserModel, TokenModel],
  controllers: [],
  //exports if i want to use outside
  //services
  providers: [
    UserRepository,
    JwtService,
    TokenRepository,
    TokenService,
  ],
  //controllers
    exports: [
        UserRepository,
        JwtService,
        TokenRepository,
      TokenService,
      UserModel,
      TokenModel
  ],
})
export class SharedAuthenticationModule {}
