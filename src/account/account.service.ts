import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
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

  async create(data: any): Promise<void> {
    const findAccount = await this.repository.findOne({
      where: { name: data?.name },
    });
    if (findAccount) {
      throw new BadRequestException('Account already exists');
    }

    const findCurrency = await this.currencyService.findById(data?.currencyId);

    if (!findCurrency) {
      throw new BadRequestException('Currency not found');
    }

    data.initialBalance = data?.initialBalance || 0;
    data.currency = findCurrency;

    await this.repository.save(data);
  }

  async update(id: any, data: any) {
    const findAccount = await this.repository.findOne({
      where: { id },
    });

    if (!findAccount) {
      throw new BadRequestException('Account not found');
    }

    const findCurrency = await this.currencyService.findById(data?.currencyId);

    if (!findCurrency) {
      throw new BadRequestException('Currency not found');
    }

    const account = await this.repository.findOne({
      where: { name: data?.name },
    });

    if (account && account.id !== id) {
      throw new BadRequestException('Account already exists');
    }

    data.initialBalance = data?.initialBalance || 0;
    data.currency = findCurrency;

    delete data.currencyId;

    return this.repository.update(id, { ...data });
  }
}
