import { Module } from '@nestjs/common';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Account]), CurrencyModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
