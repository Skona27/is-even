import { IsUUID, IsDate, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Order } from '../order.entity';
import { CreditLimit } from '../../credit/interface/credit-limit.interface';
import { CreditDuration } from '../../credit/interface/credit-duration.interface';
import { OrderStatus } from '../interface/order-status.interface';

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
  @IsInt()
  public price: number;

  @ApiProperty()
  @IsEnum(OrderStatus)
  public status: OrderStatus;

  public static createDtoFromEntity(order: Order): OrderDto {
    const dto = new OrderDto();

    dto.id = order.id;
    dto.price = order.price;
    dto.status = order.status;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    dto.creditLimit = order.creditLimit;
    dto.creditDuration = order.creditDuration;

    return dto;
  }
}
