import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemLog } from './system-log.entity';
import { Repository } from 'typeorm';
import { envVariables } from '../envVariables';

// TODO: as separate app on mongo

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLog) private repo: Repository<SystemLog>,
  ) {}

  async log(info: string, userId?: string, tag?: string) {
    if (!envVariables.logsEnabled) {
      return;
    }

    try {
      console.log('loggg:', info);
      await this.repo.save({ info, userId, tag });
    } catch (e) {
      console.error('errr', e);
    }
  }
}
