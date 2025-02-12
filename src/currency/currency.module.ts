import { Module } from '@nestjs/common';
import { Currency } from './currency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  exports: [],
  providers: [],
})
export class CurrencyModule {}
