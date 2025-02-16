import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController extends BaseController {
  constructor(protected readonly CurrencyService: CurrencyService) {
    super(CurrencyService);
  }
}
