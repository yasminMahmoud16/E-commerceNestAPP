import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TokenModel, TokenRepository, UserModel, UserRepository } from 'src/DB';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/common';
import{ PreAuth } from '../../common/middlewares/authentication.middleware';
import { UserService } from './user.service';
@Module({
  imports: [],
  providers: [UserService,],
  controllers: [UserController],
  exports: [],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreAuth)
      // work for all 
      .forRoutes(UserController);
      // work for specific route
      // .forRoutes({path:"user", method:RequestMethod.GET});
  }
}


