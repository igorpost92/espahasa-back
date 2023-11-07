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
import * as session from 'express-session';

const cookieSession = require('cookie-session');

// TODO:
const cookieSecret = 'my-secret';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5430,
      database: 'espahasa',
      username: 'postgres',
      password: 'postgres',
      entities: [User, Word],
      synchronize: true,
      // logging: 'all',
    }),
    WordsModule,
    UsersModule,
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
