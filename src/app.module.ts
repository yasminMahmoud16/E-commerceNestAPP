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
import { S3Service } from './common';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';

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
    BrandModule,
    CategoryModule,
    ProductModule
    
  ],
  controllers: [AppController, AuthenticationController],
  providers: [AppService, S3Service ],
})
export class AppModule {}
