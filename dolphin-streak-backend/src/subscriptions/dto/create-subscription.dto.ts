import { IsString, IsNumberString, Length, Matches } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNumberString()
  @Length(16, 16, { message: 'Card number must be exactly 16 digits.' })
  card_number: string;

  @IsNumberString()
  @Length(2, 2, { message: 'Card expiration month must be exactly 2 digits (MM).' })
  card_exp_month: string;

  @IsNumberString()
  @Length(2, 2, { message: 'Card expiration year must be exactly 2 digits (YY).' })
  card_exp_year: string;

  @IsNumberString()
  @Length(3, 3, { message: 'Card CVV must be exactly 3 digits.' })
  card_cvv: string;
}
