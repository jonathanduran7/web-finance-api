import { Currency } from 'src/currency/currency.entity';
import { Transaction } from 'src/transaction/transaction.entity';
import { Transfer } from 'src/transfer/transfer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  initialBalance: number;

  @ManyToOne(() => Currency)
  @JoinColumn()
  currency: Currency;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.sourceAccount)
  sourceTransfers: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.destinationAccount)
  destinationTransfers: Transfer[];

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];
}
