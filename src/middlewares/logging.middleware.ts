import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// TODO: morgan

export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('REQUEST');

  async use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });

    next();
  }
}
