import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemLog } from './system-log.entity';
import { Repository } from 'typeorm';
import { envVariables } from '../envVariables';
import { LoggingMessageType } from './logging-message-type';
import { userAsyncLocalStorage } from '../users/async-storages/user.async-storage';

// TODO: as separate app on mongo

interface LogParams {
  tag?: string;
  type?: LoggingMessageType;
}

@Injectable()
export class SystemLogsService {
  constructor(
    @InjectRepository(SystemLog) private repo: Repository<SystemLog>,
  ) {}

  async log(message: string, { tag, type = 'log' }: LogParams) {
    if (!envVariables.logsEnabled) {
      return;
    }

    try {
      console.log('loggg:', message);
      const { currentUser } = userAsyncLocalStorage.getStore() ?? {};
      await this.repo.save({ message, userId: currentUser?.id, tag, type });
    } catch (e) {
      console.error('errr', e);
    }
  }
}
