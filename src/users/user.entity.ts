import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// TODO: uniq
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;
}
