import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// TODO:
// user

@Entity()
export class Envelope {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column('uuid')
  envelopeId!: string;

  @Column('json')
  // TODO: type
  data!: any;
}
