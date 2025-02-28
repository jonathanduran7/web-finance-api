import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { Transfer } from './transfer.entity';
import { TransferDTO } from './transfer.dto';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController extends BaseController<Transfer, TransferDTO> {
  constructor(protected readonly transferService: TransferService) {
    super(transferService, TransferDTO);
  }
}
