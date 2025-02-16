import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  name: string;

  @IsNumber()
  currencyId: number;

  @IsNumber()
  @IsOptional()
  initialBalance: number;
}
