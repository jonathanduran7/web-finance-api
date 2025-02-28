import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransferDTO {
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  amount: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  sourceAccountId: number;

  @IsNumber()
  destinationAccountId: number;

  @IsDateString()
  @IsOptional()
  date: Date;
}
