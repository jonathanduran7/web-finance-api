import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';
import { CurrencyDto } from './currency.dto';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

@Controller('currency')
export class CurrencyController extends BaseController<Currency, CurrencyDto> {
  constructor(protected readonly CurrencyService: CurrencyService) {
    super(CurrencyService, CurrencyDto);
  }

  @Get()
  async getBase(@GetCurrentUserId() userId: number): Promise<Currency[]> {
    return this.CurrencyService.findAll({ user: { id: userId } });
  }
}
