import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { TransactionDto } from './transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Controller('transaction')
export class TransactionController extends BaseController<
  Transaction,
  TransactionDto
> {
  constructor(protected readonly transactionService: TransactionService) {
    super(transactionService, TransactionDto);
  }

  @Get('query')
  query(
    @GetCurrentUserId() userId: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order', new ParseEnumPipe(Order)) order?: Order,
    @Query('search') search?: string,
    @Query('filters') filters?: Record<string, string>,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.query(
      userId,
      page,
      limit,
      order,
      search,
      filters,
      startDate,
      endDate,
    );
  }

  @Get('dashboard')
  dashboard(
    @GetCurrentUserId() userId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.dashboard(userId, startDate, endDate);
  }
}
