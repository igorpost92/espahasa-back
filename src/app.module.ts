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
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { CategoriesWords } from './categories/categories-words/categories-words.entity';

const cookieSession = require('cookie-session');

// TODO: to env
const cookieSecret = 'my-secret';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: envVariables.database.type,
      host: envVariables.database.host,
      port: envVariables.database.port,
      database: envVariables.database.name,
      username: envVariables.database.user,
      password: envVariables.database.password,
      entities: [SystemLog, User, Word, Verb, Category, CategoriesWords],
      // TODO: disable for prod
      synchronize: true,
      // logging: 'all',
    }),
    UsersModule,
    WordsModule,
    VerbsModule,
    CategoriesModule,
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
