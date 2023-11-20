import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';
import { Lang } from '../src/models/lang.enum';
import { Word } from '../src/words/word.entity';
import { UsersService } from '../src/users/users.service';
import { SuperAgentTest } from 'supertest';
import { initializeTestApp } from './shared/initialize-app';
import { CategoriesService } from '../src/categories/categories.service';
import { PutCategoryDto } from '../src/categories/dtos/put-category.dto';
import { sessionIdHeader } from '../src/constants/session-id-header';

describe('categories-controller', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  // TODO: before each
  beforeAll(async () => {
    ({ app, agent } = await initializeTestApp());
  });

  // TODO: split to small chunks
  it('should work', async () => {
    const usersService = app.get(UsersService);
    const categoriesService = app.get(CategoriesService);
    const categoriesRepo: Repository<Word> = app.get(getRepositoryToken(Word));

    const anotherUserDto: CreateUserDto = { name: 'another', password: '123' };
    const {
      body: { sessionId },
    } = await agent.post('/users').send(anotherUserDto).expect(201);
    agent.set(sessionIdHeader, sessionId);

    const categories: PutCategoryDto[] = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'first text',
        lang: Lang.EN,
      },
    ];

    await agent.put('/categories/bulk').send(categories).expect(200);
    await agent.get('/categories').send().expect(200);
  });
});
