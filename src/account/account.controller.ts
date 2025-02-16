import { Controller } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { Account } from './account.entity';
import { AccountDto } from './account.dto';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController extends BaseController<Account, AccountDto> {
  constructor(protected readonly accountService: AccountService) {
    super(accountService, AccountDto);
  }
}
