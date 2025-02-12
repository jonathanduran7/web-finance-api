import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CurrencyModule } from './currency/currency.module';

@Module({
  imports: [DatabaseModule, CurrencyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
