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
    const [account, category] = await Promise.all([
      this.accountService.findById(data.accountId),
      this.categoryService.findById(data.categoryId),
    ]);

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (account.balance + data.amount < 0) {
      throw new BadRequestException('Insufficient funds');
    }

    const transaction = this.repository.create({
      ...data,
      account,
      category,
      createdAt: data.date ?? new Date(),
      updatedAt: data.date ?? new Date(),
    });

    await this.accountService.updateBalance(account.id, data.amount);

    await this.repository.save(transaction);
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
      relations: ['account'],
    });

    if (!findTransaction) {
      throw new BadRequestException('Transaction not found');
    }

    const [account, category] = await Promise.all([
      this.accountService.findById(data.accountId),
      this.categoryService.findById(data.categoryId),
    ]);

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    if (account.balance + data.amount < 0) {
      throw new BadRequestException('Insufficient funds');
    }

    await this.accountService.updateBalance(
      findTransaction.account.id,
      -findTransaction.amount,
    );

    await this.accountService.updateBalance(account.id, data.amount);

    const updateTransaction = {
      ...data,
      account,
      category,
      updatedAt: data.date ?? new Date(),
    };

    delete updateTransaction.date;
    delete updateTransaction.accountId;
    delete updateTransaction.categoryId;

    return this.repository.update(id, updateTransaction);
  }

  async query(
    page: number = 1,
    limit: number = 5,
    order: 'ASC' | 'DESC' = 'ASC',
    search?: string,
    filters?: { [key: string]: any },
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.account', 'account')
      .leftJoinAndSelect('transaction.category', 'category');

    if (filters) {
      Object.keys(filters).forEach((key) => {
        queryBuilder.andWhere(`transaction.${key} = :${key}`, {
          [key]: filters[key],
        });
      });
    }

    if (search) {
      queryBuilder.andWhere(
        'transaction.title ILIKE :search or transaction.description ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transaction.updatedAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('transaction.updatedAt >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('transaction.updatedAt <= :endDate', {
        endDate,
      });
    }

    queryBuilder
      .orderBy('transaction.updatedAt', order)
      .addOrderBy('transaction.id', order)
      .take(limit)
      .skip((page - 1) * limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < Math.ceil(total / limit) ? Number(page) + 1 : null,
    };
  }

  async dashboard(startDate?: string, endDate?: string) {
    const [balance, categories, accounts] = await Promise.all([
      this.getBalance(startDate, endDate),
      this.categoryService.getBalance(startDate, endDate),
      this.accountService.getBalances(),
    ]);

    return {
      balance,
      categories,
      accounts,
    };
  }

  async getBalance(startDate: string, endDate: string): Promise<any> {
    const balance = await this.repository
      .createQueryBuilder('transactions')
      .select('SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS income')
      .addSelect('SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS expense')
      .addSelect('SUM(amount) AS total')
      .where('transactions.updatedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('transactions.categoryId != 9')
      .getRawOne();

    return balance;
  }

  async delete(id: any): Promise<void> {
    const transaction = await this.repository.findOne({
      where: { id },
      relations: ['account'],
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    await this.accountService.updateBalance(
      transaction.account.id,
      -transaction.amount,
    );

    await this.repository.delete(id);
  }
}
