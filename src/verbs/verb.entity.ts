import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Word } from '../words/word.entity';
import { VerbDataModel } from './verb-data.model';

@Entity()
// TODO:
export class Verb {
  @ManyToOne(() => Word, { onDelete: 'CASCADE' })
  word?: Word;

  @PrimaryColumn()
  wordId!: string;

  @Column('json')
  data!: VerbDataModel;
}
