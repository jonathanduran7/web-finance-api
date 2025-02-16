import { Module } from '@nestjs/common';
import { Currency } from './currency.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  exports: [],
  providers: [],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
