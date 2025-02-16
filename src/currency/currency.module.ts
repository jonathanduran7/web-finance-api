import { Module } from '@nestjs/common';
import { Currency } from './currency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  exports: [CurrencyService],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
