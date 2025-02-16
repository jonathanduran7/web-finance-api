import { IsNumberString, IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  name: string;

  @IsNumberString()
  currencyId: number;
}
