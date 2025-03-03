import { Account } from 'src/account/account.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Account, (account) => account.currency)
  accounts: Account[];

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
