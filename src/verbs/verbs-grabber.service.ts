import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { In, Not } from 'typeorm';
import { WordsService } from '../words/words.service';
import { VerbsService } from './verbs.service';
import { stealVerbs } from './utils/verbsGrabber';
import { Verb } from './verb.entity';

@Injectable()
export class VerbsGrabberService {
  constructor(
    private verbsService: VerbsService,
    private wordsService: WordsService,
  ) {}

  // TODO: full
  async updateVerbs(user: User) {
    const verbs = await this.getAbsentVerbs(user);

    if (!verbs.length) {
      console.log('No verbs to load');
      return;
    }

    console.log(
      'Verbs',
      verbs.length,
      verbs.map((item) => item.text),
    );

    const result = await stealVerbs(verbs);

    if (!result.length) {
      console.log('No result after requests');
      return;
    }

    this.verbsService.saveBulk(result as Verb[]);
  }

  private async getAbsentVerbs(user: User) {
    const existingVerbs = await this.verbsService.getAllVerbs(user, true);
    const wordsIds = existingVerbs.map((item) => item.word.id);

    const verbsWords = await this.wordsService.getAllWords(user, {
      type: 'verb',
      id: Not(In(wordsIds)),
    });

    return verbsWords;
  }
}
