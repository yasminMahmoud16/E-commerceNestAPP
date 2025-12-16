import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';

import{ PreAuth } from '../../common/middlewares/authentication.middleware';
import { UserService } from './user.service';
import { S3Service } from 'src/common';
@Module({
  imports: [
    // MulterModule.register(
    // {
    // storage: diskStorage({
    //   destination(req:Request, file:Express.Multer.File, callback:Function) {
    //     callback(null,'./upload')
    //   },
    //   filename(req:Request, file:Express.Multer.File, callback:Function) {
    //     const fileName = randomUUID()+"_"+Date.now()+"_"+file.originalname
    //     callback(null,fileName)
    //   },

    // })
    // }
    // )
  ],
  providers: [UserService, S3Service],
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


