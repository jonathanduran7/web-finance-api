import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
