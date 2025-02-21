import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  title: string;

  @IsNumber()
  accountId: number;

  @IsNumber()
  categoryId: number;
}
