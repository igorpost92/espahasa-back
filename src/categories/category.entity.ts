import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  // TODO: enum
  @Column()
  lang!: string;

  @ManyToOne(() => User)
  user?: User;

  @Column()
  userId!: string;
}
