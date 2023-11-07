import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { WordExampleDto } from './dtos/word-example.dto';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  text!: string;

  @Column()
  meaning!: string;

  @Column({ nullable: true })
  step?: number;

  @Column({ nullable: true })
  lastDate?: Date;

  // TODO: enum
  @Column()
  lang!: string;

  // TODO: enum
  @Column({ nullable: true })
  type?: string;

  // TODO:
  @Column({ type: 'json', nullable: true })
  examples?: WordExampleDto[];

  @ManyToOne(() => User)
  user!: User;
}
