import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors';

async function bootstrap() {
  const port = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(  new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true, // not all key just with @property
      forbidNonWhitelisted: true, // tells me there is an extra field 
      // dismissDefaultMessages: true, // no default message will return
      // disableErrorMessages:true // all messages error will not show 
      // skipUndefinedProperties:true, // if field require and user dose not sent will be undefined
      // skipNullProperties: true, // if field require and user dose not sent will be null
      // skipMissingProperties:true //both null and undefined 
  }))
  app.useGlobalInterceptors(new LoggingInterceptor)
  await app.listen(port, () => {
    console.log(`Server is running in port::: ${port} 🌸🚀`);
  });
}
bootstrap();
