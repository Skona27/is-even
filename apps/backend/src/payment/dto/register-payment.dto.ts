import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RegisterPaymentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;
}
