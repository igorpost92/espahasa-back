import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req.currentUser;
  },
);
