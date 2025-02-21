import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    repository: Repository<Transaction>,
    private categoryService: CategoryService,
    private accountService: AccountService,
  ) {
    super(repository);
  }

  async create(data: any): Promise<void> {
    const findAccount = await this.accountService.findById(data.accountId);

    if (!findAccount) {
      throw new BadRequestException('Account not found');
    }

    const findCategory = await this.categoryService.findById(data.categoryId);

    if (!findCategory) {
      throw new BadRequestException('Category not found');
    }

    data.account = findAccount;
    data.category = findCategory;

    await this.repository.save(data);
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.repository.find({
      relations: ['account', 'category'],
    });
    return transactions;
  }

  async findById(id: any): Promise<Transaction> {
    const transaction = await this.repository.findOne({
      where: { id },
      relations: ['account', 'category'],
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return transaction;
  }

  async update(id: any, data: any) {
    const findTransaction = await this.repository.findOne({
      where: { id },
    });

    if (!findTransaction) {
      throw new BadRequestException('Transaction not found');
    }

    const findAccount = await this.accountService.findById(data.accountId);

    if (!findAccount) {
      throw new BadRequestException('Account not found');
    }

    const findCategory = await this.categoryService.findById(data.categoryId);

    if (!findCategory) {
      throw new BadRequestException('Category not found');
    }

    data.account = findAccount;
    data.category = findCategory;

    delete data.accountId;
    delete data.categoryId;

    return this.repository.update(id, data);
  }
}
