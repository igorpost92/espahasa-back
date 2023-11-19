import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Word } from '../words/word.entity';
import { CategoriesWords } from './categories-words/categories-words.entity';
import { CategoriesWordsService } from './categories-words/categories-words.service';
import { CategoriesWordsController } from './categories-words/categories-words.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Word, Category, CategoriesWords])],
  controllers: [CategoriesController, CategoriesWordsController],
  providers: [CategoriesService, CategoriesWordsService],
})
export class CategoriesModule {}
