import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const port = process.env.APP_PORT || 3000;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log('App is listening on port', port);
}

bootstrap();
