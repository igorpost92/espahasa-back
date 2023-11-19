import { NestFactory } from '@nestjs/core';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import { envVariables } from './envVariables';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule);
  // TODO: research
  // @ts-expect-error not defined
  app.useBodyParser('json', { limit: '1mb' });

  app.setGlobalPrefix('api');
  app.enableCors({
    // TODO: research
    credentials: true,
    origin: true,
  });

  app.use(cookieParser());

  const port = envVariables.appPort;
  await app.listen(port);
  console.log('App is listening on port', port);
}

bootstrap();
