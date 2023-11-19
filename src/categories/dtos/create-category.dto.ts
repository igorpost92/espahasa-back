import { IsEnum, IsString } from 'class-validator';
import { Lang } from '../../models/lang.enum';

export class CreateCategoryDto {
  @IsString()
  name!: string;

  @IsEnum(Lang)
  lang!: Lang;
}
