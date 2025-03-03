import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Account } from './account.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    repository: Repository<Account>,
    private currencyService: CurrencyService,
  ) {
    super(repository);
  }

  async findAll(filters: FindOptionsWhere<Account>): Promise<Account[]> {
    const accounts = await this.repository.find({
      relations: ['currency'],
      where: filters,
    });
    return accounts;
  }

  async create(data: any, userId: number): Promise<void> {
    const findAccount = await this.repository.findOne({
      where: { name: data?.name, user: { id: userId } },
    });
    if (findAccount) {
      throw new BadRequestException('Account already exists');
    }

    const findCurrency = await this.currencyService.findById(data?.currencyId);

    if (!findCurrency) {
      throw new BadRequestException('Currency not found');
    }

    if (findCurrency?.user?.id !== userId) {
      throw new BadRequestException('Currency not found');
    }

    data.balance = data?.balance || 0;
    data.currency = findCurrency;
    data.user = { id: userId };

    await this.repository.save(data);
  }

  async update(id: any, data: any, userId: number) {
    const findAccount = await this.repository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!findAccount) {
      throw new BadRequestException('Account not found');
    }

    const findCurrency = await this.currencyService.findById(data?.currencyId);

    if (!findCurrency) {
      throw new BadRequestException('Currency not found');
    }

    if (findCurrency?.user?.id !== userId) {
      throw new BadRequestException('Currency not found');
    }

    const account = await this.repository.findOne({
      where: { name: data?.name },
    });

    if (account && account.id !== id) {
      throw new BadRequestException('Account already exists');
    }

    data.balance = data?.balance || 0;
    data.currency = findCurrency;

    delete data.currencyId;

    return this.repository.update(id, { ...data });
  }

  async delete(id: any, userId: number) {
    const { affected } = await this.repository.delete({
      id,
      user: { id: userId },
    });
    if (!affected) {
      throw new NotFoundException('Data not found');
    }
    return;
  }

  async getBalances(userId: number) {
    const balance = await this.repository
      .createQueryBuilder('accounts')
      .select('accounts.name as account')
      .addSelect('accounts.balance as total')
      .where('accounts.userId = :userId', { userId })
      .orderBy('accounts.name', 'ASC')
      .getRawMany();

    return balance;
  }

  async updateBalance(id: any, amount: number) {
    const account = await this.repository.findOne({
      where: { id },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (account.balance + amount < 0) {
      throw new BadRequestException('Insufficient funds');
    }

    account.balance = parseFloat(account.balance.toString()) + amount;

    return this.repository.update(id, { balance: account.balance });
  }
}
