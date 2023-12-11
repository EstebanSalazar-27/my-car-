import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  price: number;
  @Column()
  currency: string;
}
