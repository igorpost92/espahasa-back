import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { WordExampleDto } from './word-example.dto';
import { Type } from 'class-transformer';
import { Lang } from '../../models/lang.enum';

export class CreateWordDto {
  @IsString()
  text!: string;

  @IsString()
  meaning!: string;

  @IsEnum(Lang)
  lang!: Lang;

  // TODO: enum
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Type(() => WordExampleDto)
  @ValidateNested()
  examples?: WordExampleDto[];
}
