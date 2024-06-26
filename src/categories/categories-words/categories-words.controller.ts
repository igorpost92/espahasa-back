import {
  Body,
  Controller,
  Get,
  Put,
  ParseArrayPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '../../users/guards/auth.guard';
import { CategoriesWordsService } from './categories-words.service';
import { SystemLogsService } from '../../system-logs/system-logs.service';
import { CurrentUser } from '../../users/decorators/current-user.decorator';
import { User } from '../../users/user.entity';
import { PutCategoriesWordsDto } from './dtos/put-categories-words.dto';
import { Transactional } from 'typeorm-transactional';

@Controller('categories-words')
@UseGuards(AuthGuard)
export class CategoriesWordsController {
  constructor(
    private categoriesWordsService: CategoriesWordsService,
    private logsService: SystemLogsService,
  ) {}

  @Get()
  getAllEntries(@CurrentUser() user: User) {
    return this.categoriesWordsService.getAll(user);
  }

  @Put('bulk')
  @Transactional()
  async importCategories(
    @Body(new ParseArrayPipe({ items: PutCategoriesWordsDto }))
    data: PutCategoriesWordsDto[],
    @CurrentUser() user: User,
  ) {
    for (const dataItem of data) {
      const existingEntry = await this.categoriesWordsService.getOneById(
        dataItem.id,
        true,
      );

      if (existingEntry) {
        if (existingEntry.category?.userId !== user.id) {
          throw new UnauthorizedException('Category belongs to another user');
        }

        if (existingEntry.word?.userId !== user.id) {
          throw new UnauthorizedException('Word belongs to another user');
        }
      }
    }

    await this.categoriesWordsService.deleteAll(user);
    await this.categoriesWordsService.addMany(data);

    this.logsService.log('upload categories-words', { tag: 'upload' });
  }
}
