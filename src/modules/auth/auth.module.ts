import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { OtpModel, } from '../../DB/models';
import { OtpRepository,} from '../../DB/repository';

@Module({
  //import from outside
  // imports: [UserModel, OtpModel, TokenModel],
  imports: [ OtpModel],
  //exports if i want to use outside
  //services
  providers: [
    AuthenticationService,
    // UserRepository,
    OtpRepository,
    // JwtService,
    // TokenRepository,
    // TokenService,
  ],
  //controllers
  controllers: [AuthenticationController ],
  exports: [
    AuthenticationService,
    // SharedAuthenticationModule
  ],
})
export class AuthenticationModule {}
