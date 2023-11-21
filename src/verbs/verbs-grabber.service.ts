import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { In, Not } from 'typeorm';
import { WordsService } from '../words/words.service';
import { VerbsService } from './verbs.service';
import { stealVerb } from './utils/verbsGrabber';
import { SystemLogsService } from '../system-logs/system-logs.service';
import { Lang } from '../models/lang.enum';
import { retry } from '../utils/retry';
import { wait } from '../utils/wait';

@Injectable()
export class VerbsGrabberService {
  constructor(
    private verbsService: VerbsService,
    private wordsService: WordsService,
    private logsService: SystemLogsService,
  ) {}

  // TODO: full refresh
  async updateVerbs(user: User) {
    const verbs = await this.getAbsentVerbs(user);

    if (!verbs.length) {
      return false;
    }

    for (let i = 0; i < verbs.length; i++) {
      if (i) {
        await wait(1000);
      }

      const { id, text } = verbs[i];
      console.log(`${i + 1}/${verbs.length}: ${text}`);

      try {
        const data = await retry(3, 10000, () => stealVerb(text));
        if (!data) {
          console.log('\t- not found');
          continue;
        }

        await this.verbsService.saveVerb({
          wordId: id,
          data,
        });
      } catch (err) {
        this.logsService.log(String(err), { type: 'error' });
      }
    }

    return true;
  }

  private async getAbsentVerbs(user: User) {
    const existingVerbs = await this.verbsService.getAllVerbs(user, true);
    const wordsIds = existingVerbs.map((item) => item.wordId);

    const verbsWords = await this.wordsService.getAllWords(user, {
      type: 'verb',
      id: Not(In(wordsIds)),
      lang: Lang.ES,
    });

    return verbsWords;
  }
}
