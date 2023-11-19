import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  info!: string;
}
