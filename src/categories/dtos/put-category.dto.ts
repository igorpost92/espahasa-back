import { IsUUID } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class PutCategoryDto extends CreateCategoryDto {
  @IsUUID()
  id!: string;
}
