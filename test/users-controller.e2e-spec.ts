import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';
import { SuperAgentTest } from 'supertest';
import { initializeTestApp } from './shared/initialize-app';
import { UserSession } from '../src/users/user-session.entity';
import { User } from '../src/users/user.entity';
import { sessionIdHeader } from '../src/constants/session-id-header';

describe('users-controller', () => {
  let app: INestApplication;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    ({ app, agent } = await initializeTestApp());
  });

  afterEach(async () => {
    await app.close();
  });

  // TODO: tests
  // create user when already exists

  it('should block access when user is anonymous', async () => {
    await agent.get('/words').send().expect(401);
  });

  it('should allow access when user is authenticated', async () => {
    const userDto: CreateUserDto = { name: 'user', password: '123' };
    const response = await agent.post('/users').send(userDto).expect(201);
    const { sessionId } = response.body;

    await agent
      .get('/words')
      .set(sessionIdHeader, sessionId)
      .send()
      .expect(200);
  });

  it('should not sign in when user not found', async () => {
    const userDto: CreateUserDto = { name: 'user', password: '123' };
    await agent.post('/users/sessions').send(userDto).expect(404);
  });

  it('should create user and return sessionId', async () => {
    const usersRepo: Repository<User> = app.get(getRepositoryToken(User));
    const sessionsRepo: Repository<UserSession> = app.get(
      getRepositoryToken(UserSession),
    );

    const userDto: CreateUserDto = { name: 'user', password: '123' };

    const response = await agent.post('/users').send(userDto).expect(201);
    const { sessionId } = response.body;

    const usersData = await usersRepo.find();
    expect(usersData).toHaveLength(1);
    expect(usersData[0].name).toEqual(userDto.name);
    expect(usersData[0].password).not.toEqual(userDto.password);

    const sessionsData = await sessionsRepo.find();
    expect(sessionsData).toHaveLength(1);
    expect(sessionsData[0].userId).toEqual(usersData[0].id);

    expect(sessionId).toEqual(sessionsData[0].id);
  });

  it('should sign in user and return sessionId', async () => {
    const usersRepo: Repository<User> = app.get(getRepositoryToken(User));
    const sessionsRepo: Repository<UserSession> = app.get(
      getRepositoryToken(UserSession),
    );

    const userDto: CreateUserDto = { name: 'user', password: '123' };
    const signUpResponse = await agent.post('/users').send(userDto).expect(201);

    const signInResponse = await agent
      .post('/users/sessions')
      .send(userDto)
      .expect(201);

    const usersData = await usersRepo.find();
    expect(usersData).toHaveLength(1);
    expect(usersData[0].name).toEqual(userDto.name);
    expect(usersData[0].password).not.toEqual(userDto.password);

    const sessionsData = await sessionsRepo.find();
    expect(sessionsData).toHaveLength(2);
    expect(sessionsData).toContainEqual(
      expect.objectContaining({ id: signUpResponse.body.sessionId }),
    );
    expect(sessionsData).toContainEqual(
      expect.objectContaining({ id: signInResponse.body.sessionId }),
    );
  });
});
