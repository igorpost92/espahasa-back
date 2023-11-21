import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { smartRound } from '../utils/smartRound';

// TODO: morgan

const formatTime = (ms: number) => {
  if (ms < 1000) {
    return `${ms} ms`;
  }

  const seconds = smartRound(ms / 1000);
  return `${seconds} s`;

  // TODO: minutes
};

export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('REQUEST');

  async use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', () => {
      const end = performance.now();
      const executionTime = Math.round(end - start);

      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} - ${formatTime(
          executionTime,
        )}`,
      );
    });

    next();
  }
}
