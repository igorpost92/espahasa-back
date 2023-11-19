import { IsUUID } from 'class-validator';
import { CreateCategoriesWordsDto } from './create-categories-words.dto';

export class PutCategoriesWordsDto extends CreateCategoriesWordsDto {
  @IsUUID()
  id!: string;
}
