import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Transfer } from './transfer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransferService extends BaseService<Transfer> {
  constructor(
    @InjectRepository(Transfer)
    repository: Repository<Transfer>,
  ) {
    super(repository);
  }
}
