import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Envelope } from './envelope.entity';
import { DataSource, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Word } from '../words/word.entity';
import { Category } from '../categories/category.entity';
import { CategoriesWords } from '../categories/categories-words/categories-words.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '../users/guards/auth.guard';
import { SystemLogsService } from '../system-logs/system-logs.service';

@Controller('sync')
@UseGuards(AuthGuard)
export class SyncController {
  constructor(
    @InjectRepository(Envelope) private repo: Repository<Envelope>,
    @InjectDataSource() private dataSource: DataSource,
    private logsService: SystemLogsService,
  ) {}

  @Post('envelope')
  createEnvelope() {
    return v4();
  }

  @Put('envelope/:id')
  async uploadData(@Param('id') envelopeId: string, @Body() data: any) {
    await this.repo.save({
      envelopeId,
      data,
    });

    this.logsService.log('sync upload envelope', { tag: 'sync' });
  }

  @Post('envelope/:id/sync')
  @Transactional()
  async syncEnvelope(
    @Param('id') envelopeId: string,
    @CurrentUser() user: User,
  ) {
    if (!envelopeId) {
      throw new BadRequestException('EnvelopeId must be provided');
    }

    const entries = await this.repo.find({
      where: { envelopeId },
      order: { createdAt: 'asc' },
    });

    const mergedData = entries.flatMap((item) => item.data);

    const words = mergedData.filter((item) => item.entryType === 'word');
    const categories = mergedData.filter(
      (item) => item.entryType === 'category',
    );
    const categoriesWords = mergedData.filter(
      (item) => item.entryType === 'word-in-category',
    );

    const parseList = async (repo: Repository<any>, list: any[]) => {
      for (const item of list) {
        const value = item.value;

        // TODO: check user when updating and deleting

        if (value == null) {
          await repo.delete(item.entryId);
        } else {
          await repo.save({ userId: user.id, ...value });
        }
      }
    };

    await parseList(this.dataSource.getRepository(Word), words);
    await parseList(this.dataSource.getRepository(Category), categories);
    await parseList(
      this.dataSource.getRepository(CategoriesWords),
      categoriesWords,
    );

    await this.repo.delete({ envelopeId });

    this.logsService.log('sync done', { tag: 'sync' });
  }
}
