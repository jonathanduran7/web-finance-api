import { Get, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';

@Injectable()
export class CurrencyService extends BaseService {
  @Get()
  findAll(): { data: string } {
    return { data: 'findAll desde currency' };
  }
}
