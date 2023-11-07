import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from './word.entity';
import { Repository } from 'typeorm';
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

  async getAllWords(user: User) {
    const words = await this.wordsRepo.find({
      where: { user },
      relations: { user: true },
    });
    return words;
  }

  async getWord(id: string) {
    if (!id) {
      return null;
    }

    // TODO: 2 queries with relations
    const word = await this.wordsRepo.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
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
