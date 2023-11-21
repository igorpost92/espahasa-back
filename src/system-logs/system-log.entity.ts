import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoggingMessageType } from './logging-message-type';

@Entity()
export class SystemLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  tag?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  message!: string;

  // TODO: not nullable
  @Column({ nullable: true, default: 'log' })
  type!: LoggingMessageType;
}
