import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  pinId: string;

  @Column({ nullable: true })
  authorId: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  club: string;

  @Column({ nullable: true })
  comment: number;

  @Column({ nullable: true })
  like: number;
}
