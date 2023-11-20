import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';
import { PutWordDto } from '../src/words/dtos/put-word.dto';
import { Lang } from '../src/models/lang.enum';
import { Word } from '../src/words/word.entity';
import { WordsService } from '../src/words/words.service';
import { UsersService } from '../src/users/users.service';
import { initializeTestApp } from './shared/initialize-app';
import { SuperAgentTest } from 'supertest';
import { sessionIdHeader } from '../src/constants/session-id-header';

describe('words-controller', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  // TODO: before each
  beforeAll(async () => {
    ({ app, agent } = await initializeTestApp());
  });

  // TODO: split to small chunks
  it('should work', async () => {
    const usersService = app.get(UsersService);
    const wordsService = app.get(WordsService);
    const wordsRepo: Repository<Word> = app.get(getRepositoryToken(Word));

    const anotherUser = await usersService.createUser({
      name: 'another',
      password: '123',
    });

    const anotherWord = await wordsService.saveWord({
      id: '11111111-1111-1111-1111-111111111111',
      createdAt: new Date('2023/01/01'),
      text: 'first text',
      meaning: 'first meaning',
      lang: Lang.EN,
      userId: anotherUser.id,
    });

    const user: CreateUserDto = { name: 'second', password: '111' };
    const {
      body: { sessionId },
    } = await agent.post('/users').send(user);
    agent.set(sessionIdHeader, sessionId);

    const userWord: PutWordDto = {
      id: '22222222-2222-2222-2222-222222222222',
      createdAt: new Date('2023/01/01'),
      text: 'second text',
      meaning: 'second meaning',
      lang: Lang.ES,
    };

    await agent.put('/words/bulk').send([userWord]).expect(200);

    let allWords = await wordsRepo.find();
    expect(allWords).toHaveLength(2);
    // TODO: without indices
    expect(allWords[0].id).toEqual(anotherWord.id);
    expect(allWords[1].id).toEqual(userWord.id);

    // should only clear this user data
    await agent.put('/words/bulk').send([]).expect(200);

    allWords = await wordsRepo.find();
    expect(allWords).toHaveLength(1);
    expect(allWords[0].id).toEqual(anotherWord.id);

    // shouldn't allow to change entry of another user
    await agent
      .put('/words/bulk')
      .send([{ ...userWord, id: anotherWord.id }])
      .expect(401);

    allWords = await wordsRepo.find();
    expect(allWords).toHaveLength(1);
    expect(allWords[0].id).toEqual(anotherWord.id);

    // should remove those words that are not in the new list
    const newWordId = '33333333-3333-3333-3333-333333333333';

    await agent
      .put('/words/bulk')
      .send([{ ...userWord, id: newWordId }])
      .expect(200);

    allWords = await wordsRepo.find();
    expect(allWords).toHaveLength(2);
    expect(allWords[0].id).toEqual(anotherWord.id);
    expect(allWords[1].id).toEqual(newWordId);
  });
});
