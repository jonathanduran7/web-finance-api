import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Transfer } from './transfer.entity';

@Injectable()
export class TransferService extends BaseService<Transfer> {}
