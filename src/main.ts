import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './modules/shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.APP_PORT || 4000;
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Food APP')
    .setDescription('Food API documentation')
    .setVersion('1.0')
    .addTag('Food')
    .build()

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1', app, document);

  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  console.log('App Running on port: ', port);
}
bootstrap();
