import { Controller, Get } from '@nestjs/common';
import { BaseController } from 'src/core/base.controller';
import { Account } from './account.entity';
import { AccountDto } from './account.dto';
import { AccountService } from './account.service';
import { GetCurrentUserId } from 'src/commons/decorators/get-current-user-id.decorator';

@Controller('account')
export class AccountController extends BaseController<Account, AccountDto> {
  constructor(protected readonly accountService: AccountService) {
    super(accountService, AccountDto);
  }

  @Get()
  async getBase(@GetCurrentUserId() userId: number): Promise<Account[]> {
    return this.accountService.findAll({ user: { id: userId } });
  }
}
