import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';

@Controller('currency')
export class CurrencyController extends BaseController<Currency> {
  constructor(protected readonly CurrencyService: CurrencyService) {
    super(CurrencyService);
  }
}
