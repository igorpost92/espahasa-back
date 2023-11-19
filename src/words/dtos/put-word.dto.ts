import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Lang } from '../../models/lang.enum';
import { WordExampleDto } from './word-example.dto';

export class PutWordDto {
  @IsUUID()
  id!: string;

  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @IsString()
  text!: string;

  @IsString()
  meaning!: string;

  @IsOptional()
  @Min(0)
  // TODO: to db
  @IsNumber({ maxDecimalPlaces: 0 })
  step?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastDate?: Date;

  @IsEnum(Lang)
  lang!: Lang;

  // TODO: enum
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => WordExampleDto)
  examples?: WordExampleDto[];
}
