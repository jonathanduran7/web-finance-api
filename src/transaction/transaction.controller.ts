import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { TransactionDto } from './transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController extends BaseController<
  Transaction,
  TransactionDto
> {
  constructor(protected readonly transactionService: TransactionService) {
    super(transactionService, TransactionDto);
  }
}
