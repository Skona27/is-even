import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { CreditDuration } from '../../credit/interface/credit-duration.interface';
import { CreditLimit } from '../../credit/interface/credit-limit.interface';

export class CreateOrderDto {
  @ApiProperty()
  @IsEnum(CreditLimit)
  creditLimit: CreditLimit;

  @ApiProperty()
  @IsEnum(CreditDuration)
  creditDuration: CreditDuration;
}
