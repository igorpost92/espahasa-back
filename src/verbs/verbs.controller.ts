import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../users/guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { VerbsService } from './verbs.service';
import { VerbsGrabberService } from './verbs-grabber.service';

@Controller('verbs')
@UseGuards(AuthGuard)
export class VerbsController {
  constructor(
    private verbsGrabberService: VerbsGrabberService,
    private verbsService: VerbsService,
  ) {}

  @Post()
  async syncVerbs(@CurrentUser() user: User) {
    const updated = await this.verbsGrabberService.updateVerbs(user);
    return { updated };
  }

  @Get()
  async getAllVerbs(@CurrentUser() user: User) {
    return this.verbsService.getAllVerbs(user);
  }
}
