import { Account } from 'src/account/account.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.sourceTransfers, {
    nullable: false,
  })
  @JoinColumn({ name: 'sourceAccountId' })
  sourceAccount: Account;

  @ManyToOne(() => Account, (account) => account.destinationTransfers, {
    nullable: false,
  })
  @JoinColumn({ name: 'destinationAccountId' })
  destinationAccount: Account;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
