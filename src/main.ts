import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationException, ValidationFilter } from './modules/shared/filters/validation.filter';
import { ResponseInterceptor } from './modules/shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.APP_PORT || 4000;
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Food APP')
    .setDescription('Food API documentation')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/v1', app, document);

  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: false,
    exceptionFactory: (errors: ValidationError[]) => {
      const errMsg = {};
      errors.forEach(err => {
        errMsg[err.property] = [...Object.values(err.constraints)];
      });
      return new ValidationException(errMsg);
    }
  }));
  await app.listen(port);
  console.log('App Running on port: ', port);
}
bootstrap();
