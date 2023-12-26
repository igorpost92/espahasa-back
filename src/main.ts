import * as fs from 'fs/promises';
import { NestFactory } from '@nestjs/core';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { AppModule } from './app.module';
import { envVariables } from './envVariables';
import { NestApplicationOptions } from '@nestjs/common';

const getHttpsOptions = async () => {
  if (!envVariables.https) {
    return;
  }

  const { keyPath, certPath } = envVariables.https;

  const key = await fs.readFile(keyPath);
  const cert = await fs.readFile(certPath);

  const httpsOptions: NestApplicationOptions['httpsOptions'] = {
    key,
    cert,
  };

  return httpsOptions;
};

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const httpsOptions = await getHttpsOptions();

  const app = await NestFactory.create(AppModule, { httpsOptions });
  // TODO: research
  // @ts-expect-error not defined
  app.useBodyParser('json', { limit: '1mb' });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    allowedHeaders: '*',
    // TODO:
    credentials: true,
  });

  const port = envVariables.appPort;
  await app.listen(port);
  console.log('App is listening on port', port);
}

bootstrap();
