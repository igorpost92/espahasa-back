import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateWordDto } from './dtos/create-word.dto';
import { User } from '../users/user.entity';

@Injectable()
export class WordsService {
  constructor(@InjectRepository(Word) private wordsRepo: Repository<Word>) {}

  async getAllWords(user: User, filter?: FindOptionsWhere<Word>) {
    const words = await this.wordsRepo.find({
      where: { ...filter, user },
    });
    return words;
  }

  async getWord(id: string) {
    if (!id) {
      return null;
    }

    return this.wordsRepo.findOneBy({ id });
  }

  createWord(createWordDto: CreateWordDto, currentUser: User) {
    const word = this.wordsRepo.create({
      ...createWordDto,
      user: currentUser,
    });

    return this.wordsRepo.save(word);
  }

  saveWord(word: Word) {
    const entry = this.wordsRepo.create(word);
    return this.wordsRepo.save(entry);
  }

  deleteWord(word: Word) {
    return this.wordsRepo.remove(word);
  }

  deleteAllWords(user: User) {
    return this.wordsRepo.delete({ user });
  }
}
