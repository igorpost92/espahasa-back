import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { VerbsService } from './verbs.service';
import { VerbsGrabberService } from './verbs-grabber.service';
import { Response } from 'express';

@Controller('verbs')
@UseGuards(AuthGuard)
export class VerbsController {
  constructor(
    private verbsGrabberService: VerbsGrabberService,
    private verbsService: VerbsService,
  ) {}

  @Post()
  async syncVerbs(
    @CurrentUser() user: User,
    @Res({ passthrough: false }) response: Response,
  ) {
    const updated = await this.verbsGrabberService.updateVerbs(user);

    if (!updated) {
      response.status(HttpStatus.NO_CONTENT);
    }

    return { updated };
  }

  @Get()
  async getAllVerbs(@CurrentUser() user: User) {
    return this.verbsService.getAllVerbs(user);
  }
}
