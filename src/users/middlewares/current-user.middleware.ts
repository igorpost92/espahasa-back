import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { sessionIdHeader } from '../../constants/session-id-header';
import { UserSessionsService } from '../user-sessions.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private sessionsService: UserSessionsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const sessionId = req.headers[sessionIdHeader] as string | undefined;

    if (sessionId) {
      const session = await this.sessionsService.getSession(sessionId);
      if (session?.user) {
        req.currentUser = session.user;
      }
    }

    next();
  }
}
