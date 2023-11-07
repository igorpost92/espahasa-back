import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class WordExampleDto {
  @Expose()
  @IsString()
  text!: string;

  @Expose()
  @IsString()
  meaning!: string;
}
