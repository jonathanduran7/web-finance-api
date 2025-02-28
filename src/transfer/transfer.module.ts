import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer])],
  controllers: [],
  providers: [],
})
export class TransferModule {}
