import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as supertest from 'supertest';

export const initializeTestApp = async () => {
  // TODO: to tests setup
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  // TODO: mock logs server

  const app = moduleRef.createNestApplication();
  await app.init();

  const agent = supertest.agent(app.getHttpServer());
  // TODO:
  //.withCredentials(true);

  return { app, agent };
};
