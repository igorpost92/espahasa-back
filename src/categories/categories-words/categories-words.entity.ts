import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Word } from '../../words/word.entity';
import { Category } from '../category.entity';

@Entity()
@Unique(['categoryId', 'wordId'])
// TODO: name
// TODO: cascade delete
export class CategoriesWords {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  category?: Category;

  @Column()
  categoryId!: string;

  @ManyToOne(() => Word, { onDelete: 'CASCADE' })
  word?: Word;

  @Column()
  wordId!: string;

  // todo required?
  @Column({ nullable: true })
  orderIndex?: number;
}
