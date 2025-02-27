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

    const transaction = this.repository.create({
      ...data,
      account,
      category,
      createdAt: data.date ?? new Date(),
      updatedAt: data.date ?? new Date(),
    });

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
        'transaction.createdAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('transaction.createdAt >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('transaction.createdAt <= :endDate', {
        endDate,
      });
    }

    queryBuilder
      .orderBy('transaction.updatedAt', order)
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
}
