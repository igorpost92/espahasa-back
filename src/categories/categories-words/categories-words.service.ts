import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CategoriesWords } from './categories-words.entity';
import { CreateCategoriesWordsDto } from './dtos/create-categories-words.dto';
import { User } from '../../users/user.entity';

@Injectable()
export class CategoriesWordsService {
  constructor(
    @InjectRepository(CategoriesWords)
    private categoriesWordsRepo: Repository<CategoriesWords>,
  ) {}

  async getAll(user: User) {
    const data = await this.categoriesWordsRepo.findBy({
      category: { user },
      word: { user },
    });

    return data;
  }

  async getOneById(id?: string, withRelations?: boolean) {
    if (!id) {
      return null;
    }

    const filter: FindOneOptions<CategoriesWords> = {
      where: { id },
    };

    if (withRelations) {
      filter.relations = {
        category: true,
        word: true,
      };
    }

    return this.categoriesWordsRepo.findOne(filter);
  }

  addOne(dto: CreateCategoriesWordsDto) {
    const entry = this.categoriesWordsRepo.create(dto);
    return this.categoriesWordsRepo.save(entry);
  }

  addMany(entries: CreateCategoriesWordsDto[]) {
    return this.categoriesWordsRepo.save(entries);
  }

  async deleteAll(user: User) {
    const entries = await this.getAll(user);
    return this.categoriesWordsRepo.remove(entries);
  }
}
