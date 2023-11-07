import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Verb } from './verb.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class VerbsService {
  constructor(@InjectRepository(Verb) private verbsRepo: Repository<Verb>) {}

  getAllVerbs(user: User, withRelations?: boolean) {
    const findOptions: FindManyOptions<Verb> = {
      where: { word: { user } },
    };

    if (withRelations) {
      findOptions.relations = { word: true };
    }

    return this.verbsRepo.find(findOptions);
  }

  saveBulk(verbs: Verb[]) {
    return this.verbsRepo.save(verbs);
  }
}
