import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserSession } from './user-session.entity';

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private sessionsRepo: Repository<UserSession>,
  ) {}

  async getSession(id: string) {
    if (!id) {
      return null;
    }

    const session = await this.sessionsRepo.findOne({
      where: { id },
      relations: { user: true },
    });
    return session;
  }

  createSession(user: User) {
    return this.sessionsRepo.save({ user });
  }

  deleteSession(id: string) {
    // TODO: if doesn't exist
    return this.sessionsRepo.delete({ id });
  }
}
