import { Expose, Type } from 'class-transformer';
import { WordExampleDto } from './word-example.dto';

export class WordResponseDto {
  @Expose()
  id!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  text!: string;

  @Expose()
  meaning!: string;

  @Expose()
  step?: number;

  @Expose()
  lastDate?: Date;

  @Expose()
  lang!: string;

  @Expose()
  type?: string;

  @Expose()
  @Type(() => WordExampleDto)
  examples?: WordExampleDto[];
}
