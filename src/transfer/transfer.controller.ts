import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { Transfer } from './transfer.entity';
import { TransferDTO } from './transfer.dto';
import { TransferService } from './transfer.service';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

@Controller('transfer')
export class TransferController extends BaseController<Transfer, TransferDTO> {
  constructor(protected readonly transferService: TransferService) {
    super(transferService, TransferDTO);
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
    return this.transferService.query(
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
}
