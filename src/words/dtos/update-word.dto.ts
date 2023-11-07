import { WordExampleDto } from './word-example.dto';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Lang } from '../../models/lang.enum';

export class UpdateWordDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  meaning?: string;

  @IsOptional()
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 0 })
  step?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastDate?: Date;

  @IsOptional()
  @IsEnum(Lang)
  lang?: Lang;

  // TODO: enum
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WordExampleDto)
  examples?: WordExampleDto[];
}
