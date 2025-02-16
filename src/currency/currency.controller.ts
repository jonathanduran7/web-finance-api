import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { CurrencyService } from './currency.service';
import { Currency } from './currency.entity';
import { CurrencyDto } from './currency.dto';

@Controller('currency')
export class CurrencyController extends BaseController<Currency, CurrencyDto> {
  constructor(protected readonly CurrencyService: CurrencyService) {
    super(CurrencyService, CurrencyDto);
  }
}
