import { IsUUID, IsDate, IsInt, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Order } from '../order.entity';
import { CreditLimit } from '../../credit/interface/credit-limit.interface';
import { CreditDuration } from '../../credit/interface/credit-duration.interface';

export class OrderDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @IsEnum(CreditLimit)
  creditLimit: CreditLimit;

  @ApiProperty()
  @IsEnum(CreditDuration)
  creditDuration: CreditDuration;

  @ApiProperty()
  @IsString()
  creditId: string;

  @ApiProperty()
  @IsInt()
  public price: number;

  public static createDtoFromEntity(order: Order): OrderDto {
    const dto = new OrderDto();

    dto.id = order.id;
    dto.price = order.price;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    dto.creditId = order.credit.id;
    dto.creditLimit = order.creditLimit;
    dto.creditDuration = order.creditDuration;

    return dto;
  }
}
