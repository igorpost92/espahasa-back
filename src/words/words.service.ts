import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateWordDto } from './dtos/create-word.dto';
import { User } from '../users/user.entity';

@Injectable()
export class WordsService {
  constructor(@InjectRepository(Word) private wordsRepo: Repository<Word>) {}

  createWord(createWordDto: CreateWordDto, currentUser: User) {
    const word = this.wordsRepo.create({
      ...createWordDto,
      user: currentUser,
    });

    return this.wordsRepo.save(word);
  }

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

    const word = await this.wordsRepo.findOneBy({ id });
    return word;
  }

  saveWord(wordDto: Word) {
    const word = this.wordsRepo.create(wordDto);
    return this.wordsRepo.save(word);
  }

  deleteWord(word: Word) {
    return this.wordsRepo.remove(word);
  }
}
