import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  word: string;

  @Column({ nullable: true })
  weight: number;
}
