import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { WordsModule } from './words/words.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  addTransactionalDataSource,
  getDataSourceByName,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { User } from './users/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { Word } from './words/word.entity';
import { VerbsModule } from './verbs/verbs.module';
import { Verb } from './verbs/verb.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { CategoriesWords } from './categories/categories-words/categories-words.entity';
import { SystemLogsModule } from './system-logs/system-logs.module';
import { SystemLog } from './system-logs/system-log.entity';
import { envVariables } from './envVariables';
import { UserSession } from './users/user-session.entity';

const cookieSession = require('cookie-session');

// TODO: to env
const cookieSecret = 'my-secret';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        const config: Partial<DataSourceOptions> = {
          type: envVariables.database.type,
          host: envVariables.database.host,
          port: envVariables.database.port,
          database: envVariables.database.name,
          username: envVariables.database.user,
          password: envVariables.database.password,
          entities: [
            User,
            UserSession,
            SystemLog,
            Word,
            Verb,
            Category,
            CategoriesWords,
          ],
          // TODO: disable for prod
          synchronize: true,
          // logging: 'all',
        };

        return config;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return (
          // TODO: error if reconnect
          getDataSourceByName('default') ||
          addTransactionalDataSource(new DataSource(options))
        );
      },
    }),
    UsersModule,
    WordsModule,
    VerbsModule,
    CategoriesModule,
    SystemLogsModule,
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
    // TODO: after https
    // consumer
    //   .apply(
    //     cookieSession({
    //       keys: [cookieSecret],
    //       sameSite: 'none',
    //     }),
    //   )
    //   .forRoutes('*');
  }
}
