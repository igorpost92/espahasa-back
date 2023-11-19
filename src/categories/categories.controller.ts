import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '../users/guards/auth.guard';
import { PutCategoryDto } from './dtos/put-category.dto';
import { SystemLogsService } from '../system-logs/system-logs.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CategoryResponseDto } from './dtos/category-response.dto';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(
    private categoriesService: CategoriesService,
    private logsService: SystemLogsService,
  ) {}

  @Get()
  @Serialize(CategoryResponseDto)
  getAllCategories(@CurrentUser() user: User) {
    return this.categoriesService.getAllCategories(user);
  }

  // @Get(':id')
  // async getCategory(@Param('id') id: string, @CurrentUser() user: User) {
  //   const category = await this.categoriesService.getCategory(id);
  //
  //   if (!category) {
  //     throw new NotFoundException('Category not found');
  //   }
  //
  //   if (user.id !== user.id) {
  //     throw new ForbiddenException('Category belongs to another user');
  //   }
  //
  //   return category;
  // }

  // TODO: serialize
  // @Post()
  // createCategory(
  //   @Body() createCategoryDto: CreateCategoryDto,
  //   @CurrentUser() user: User,
  // ) {
  //   return this.categoriesService.createCategory(createCategoryDto, user);
  // }

  // TODO: transaction
  @Put('bulk')
  async importCategories(
    @Body(new ParseArrayPipe({ items: PutCategoryDto })) data: PutCategoryDto[],
    @CurrentUser() user: User,
  ) {
    for (const dataItem of data) {
      const existingWord = await this.categoriesService.getCategory(
        dataItem.id,
      );

      if (existingWord && existingWord.userId !== user.id) {
        throw new UnauthorizedException('Category belongs to another user');
      }
    }

    await this.categoriesService.deleteAllCategories(user);

    for (const dataItem of data) {
      await this.categoriesService.saveCategory({
        ...dataItem,
        userId: user.id,
      });
    }

    this.logsService.log('upload categories', user.id, 'upload');
  }
}
