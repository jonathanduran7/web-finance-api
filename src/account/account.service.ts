import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService extends BaseService<Account> {
  constructor(
    @InjectRepository(Account)
    repository: Repository<Account>,
  ) {
    super(repository);
  }

  async create(data: any): Promise<void> {
    const findAccount = await this.repository.findOne({
      where: { name: data?.name },
    });
    if (findAccount) {
      throw new BadRequestException('Account already exists');
    }
    await this.repository.save(data);
  }
}
