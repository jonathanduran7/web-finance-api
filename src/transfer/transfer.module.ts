import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './transfer.entity';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { AccountModule } from 'src/account/account.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer]), AccountModule, UsersModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
