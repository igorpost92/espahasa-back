import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVariables } from './envVariables';

async function bootstrap() {
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

  const port = envVariables.appPort;
  await app.listen(port);
  console.log('App is listening on port', port);
}

bootstrap();
