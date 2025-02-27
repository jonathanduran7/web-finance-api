import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransactionDto {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
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

  @IsDateString()
  date: Date;
}
