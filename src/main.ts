import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  await app.listen(3621);
}
bootstrap();
