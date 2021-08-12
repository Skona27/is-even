import { ApiProperty } from '@nestjs/swagger';
import { CreditDuration } from '../interface/credit-duration.interface';
import { CreditLimit } from '../interface/credit-limit.interface';

// TODO: Add validation
export class CreateCreditDto {
  @ApiProperty()
  limit: CreditLimit;

  @ApiProperty()
  duration: CreditDuration;
}
