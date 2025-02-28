import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Transfer } from './transfer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class TransferService extends BaseService<Transfer> {
  constructor(
    @InjectRepository(Transfer)
    repository: Repository<Transfer>,
    private readonly accountService: AccountService,
  ) {
    super(repository);
  }

  async create(data: any): Promise<void> {
    const [sourceAccount, destinationAccount] = await Promise.all([
      this.accountService.findById(data.sourceAccountId),
      this.accountService.findById(data.destinationAccountId),
    ]);

    if (!sourceAccount) {
      throw new BadRequestException('Source account not found');
    }

    if (!destinationAccount) {
      throw new BadRequestException('Destination account not found');
    }

    if (sourceAccount.id === destinationAccount.id) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    const transfer = this.repository.create({
      ...data,
      sourceAccount,
      destinationAccount,
      createdAt: data.date ?? new Date(),
      updatedAt: data.date ?? new Date(),
    });

    await this.repository.save(transfer);
  }

  async update(id: any, data: any): Promise<UpdateResult> {
    const [sourceAccount, destinationAccount, transfer] = await Promise.all([
      this.accountService.findById(data.sourceAccountId),
      this.accountService.findById(data.destinationAccountId),
      this.repository.findOne({ where: { id } }),
    ]);

    if (!transfer) {
      throw new BadRequestException('Transfer not found');
    }

    if (!sourceAccount) {
      throw new BadRequestException('Source account not found');
    }

    if (!destinationAccount) {
      throw new BadRequestException('Destination account not found');
    }

    if (sourceAccount.id === destinationAccount.id) {
      throw new BadRequestException(
        'Source and destination accounts must be different',
      );
    }

    const updateTransfer = {
      ...data,
      sourceAccount,
      destinationAccount,
      updatedAt: data.date ?? new Date(),
    };

    delete updateTransfer.date;
    delete updateTransfer.sourceAccountId;
    delete updateTransfer.destinationAccountId;

    return this.repository.update(id, updateTransfer);
  }

  async query(
    page = 1,
    limit = 10,
    order: 'ASC' | 'DESC' = 'ASC',
    search: string = '',
    filters: { [key: string]: any } = {},
    startDate?: string,
    endDate?: string,
  ) {
    const queryBuilder = this.repository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.sourceAccount', 'sourceAccount')
      .leftJoinAndSelect('transfer.destinationAccount', 'destinationAccount');

    if (filters) {
      Object.keys(filters).forEach((key) => {
        queryBuilder.andWhere(`transfer.${key} = :${key}`, {
          [key]: filters[key],
        });
      });
    }

    if (search) {
      queryBuilder.andWhere('transfer.description ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'transfer.updatedAt BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('transfer.updatedAt >= :startDate', {
        startDate,
      });
    } else if (endDate) {
      queryBuilder.andWhere('transfer.updatedAt <= :endDate', {
        endDate,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('transfer.updatedAt', order)
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

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
