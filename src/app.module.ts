import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CurrencyModule } from './currency/currency.module';
import { CategoryModule } from './category/category.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [DatabaseModule, CurrencyModule, CategoryModule, AccountModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
