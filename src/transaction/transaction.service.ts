import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Transaction } from './transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { AccountService } from 'src/account/account.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionService extends BaseService<Transaction> {
  constructor(
    @InjectRepository(Transaction)
    repository: Repository<Transaction>,
    private readonly categoryService: CategoryService,
    private readonly accountService: AccountService,
    private readonly userService: UsersService,
  ) {
    super(repository);
  }

  async create(data: any, userId: number): Promise<void> {
    const [account, category, user] = await Promise.all([
      this.accountService.findById(data.accountId),
      this.categoryService.findById(data.categoryId),
      this.userService.findById(userId),
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
      user,
      createdAt: data.date ?? new Date(),
      updatedAt: data.date ?? new Date(),
    });

    await this.accountService.updateBalance(account.id, data.amount);

    await this.repository.save(transaction);
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.repository.find({
      relations: ['account', 'category', 'users'],
    });
    return transactions;
  }

  async findById(id: any): Promise<Transaction> {
    const transaction = await this.repository.findOne({
      where: { id },
      relations: ['account', 'category', 'user'],
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return transaction;
  }

  async update(id: any, data: any, userId: number) {
    const findTransaction = await this.repository.findOne({
      where: { id, user: { id: userId } },
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
    userId: number,
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
      .andWhere('transaction.userId = :userId', { userId })
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

  async dashboard(userId: number, startDate?: string, endDate?: string) {
    const [balance, categories, accounts] = await Promise.all([
      this.getBalance(userId, startDate, endDate),
      this.categoryService.getBalance(userId, startDate, endDate),
      this.accountService.getBalances(userId),
    ]);

    return {
      balance,
      categories,
      accounts,
    };
  }

  async getBalance(
    userId: number,
    startDate: string,
    endDate: string,
  ): Promise<any> {
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
      .andWhere('transactions.userId = :userId', { userId })
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
