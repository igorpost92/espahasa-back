import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { WordsModule } from './words/words.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { Word } from './words/word.entity';
import { VerbsModule } from './verbs/verbs.module';
import * as session from 'express-session';
import { Verb } from './verbs/verb.entity';

const cookieSession = require('cookie-session');

// TODO:
const cookieSecret = 'my-secret';

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = Number(process.env.DB_PORT) || 5432;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      database: 'espahasa',
      username: 'postgres',
      password: 'postgres',
      entities: [User, Word, Verb],
      synchronize: true,
      // logging: 'all',
    }),
    UsersModule,
    WordsModule,
    VerbsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // TODO: test
        whitelist: true,
        // TODO: need?
        // transform: true,
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // TODO: persists only per session
    // consumer
    //   .apply(
    //     session({
    //       secret: cookieSecret,
    //       resave: false,
    //       saveUninitialized: false,
    //       cookie: {
    //         maxAge: 1000 * 60 * 60 * 24 * 365,
    //       },
    //     }),
    //   )
    //   .forRoutes('*');

    consumer
      .apply(
        cookieSession({
          keys: [cookieSecret],
        }),
      )
      .forRoutes('*');
  }
}
