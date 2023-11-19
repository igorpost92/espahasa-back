import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoriesWordsDto {
  @IsUUID()
  categoryId!: string;

  @IsUUID()
  wordId!: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}
