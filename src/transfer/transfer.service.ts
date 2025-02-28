import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Transfer } from './transfer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
