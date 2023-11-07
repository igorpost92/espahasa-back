import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  ForbiddenException,
  NotFoundException,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dtos/create-word.dto';
import { User } from '../users/user.entity';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { AuthGuard } from '../users/guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { WordResponseDto } from './dtos/word-response.dto';
import { UpdateWordDto } from './dtos/update-word.dto';
import { Word } from './word.entity';

@Controller('words')
@UseGuards(AuthGuard)
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @Post()
  @Serialize(WordResponseDto)
  createWord(@Body() createWordDto: CreateWordDto, @CurrentUser() user: User) {
    return this.wordsService.createWord(createWordDto, user);
  }

  @Get()
  @Serialize(WordResponseDto)
  getAllWords(@CurrentUser() user: User) {
    return this.wordsService.getAllWords(user);
  }

  @Get(':id')
  @Serialize(WordResponseDto)
  async getWord(@Param('id') id: string, @CurrentUser() user: User) {
    const word = await this.wordsService.getWord(id);

    if (!word) {
      throw new NotFoundException('word not found');
    }

    if (user.id !== user.id) {
      throw new ForbiddenException('word belongs to another user');
    }

    return word;
  }

  @Put(':id')
  @Serialize(WordResponseDto)
  async updateWord(
    @Param('id') id: string,
    @Body() updateWordDto: UpdateWordDto,
    @CurrentUser() user: User,
  ) {
    const exisingWord = await this.wordsService.getWord(id);

    if (!exisingWord) {
      throw new NotFoundException('word not found');
    }

    if (user.id !== exisingWord?.user.id) {
      throw new ForbiddenException('word belongs to another user');
    }

    const updatedWord: Word = {
      ...exisingWord,
      ...updateWordDto,
    };

    return this.wordsService.saveWord(updatedWord);
  }

  @Delete(':id')
  async deleteWord(@Param('id') id: string, @CurrentUser() user: User) {
    const exisingWord = await this.wordsService.getWord(id);

    if (!exisingWord) {
      throw new NotFoundException('word not found');
    }

    if (user.id !== exisingWord?.user.id) {
      throw new ForbiddenException('word belongs to another user');
    }

    await this.wordsService.deleteWord(exisingWord);
  }
}
