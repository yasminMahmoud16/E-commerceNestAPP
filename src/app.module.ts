import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationController } from './modules/auth/auth.controller';
import { AuthenticationModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedAuthenticationModule } from './common/modules/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.development'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, { serverSelectionTimeoutMS: 30000 }),
    SharedAuthenticationModule,
    AuthenticationModule,
    UserModule,
  ],
  controllers: [AppController, AuthenticationController],
  providers: [AppService],
})
export class AppModule {}
