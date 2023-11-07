import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Word } from '../words/word.entity';
import { VerbDataModel } from './verb-data.model';

@Entity()
export class Verb {
  @ManyToOne(() => Word)
  word!: Word;

  @PrimaryColumn()
  wordId!: string;

  // TODO
  @Column('json')
  data!: VerbDataModel;
}
