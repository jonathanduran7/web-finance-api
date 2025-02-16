import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Currency } from './currency.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CurrencyService extends BaseService<Currency> {
  constructor(
    @InjectRepository(Currency)
    repository: Repository<Currency>,
  ) {
    super(repository);
  }
}
