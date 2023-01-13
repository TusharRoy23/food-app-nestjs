import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = +process.env.APP_PORT || 4000;
  await app.listen(port);
  console.log('App Running on port: ', port);
}
bootstrap();
