import { IsUUID, IsDate, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Credit } from '../credit.entity';

export class CreditDto {
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
  @IsInt()
  public limit: number;

  @ApiProperty()
  @IsInt()
  public usage: number;

  @ApiProperty()
  @IsDate()
  public fromDate: Date;

  @ApiProperty()
  @IsDate()
  public toDate: Date;

  public static createDtoFromEntity(credit: Credit): CreditDto {
    const dto = new CreditDto();

    dto.id = credit.id;
    dto.limit = credit.limit;
    dto.usage = credit.usage;
    dto.createdAt = credit.createdAt;
    dto.updatedAt = credit.updatedAt;
    dto.fromDate = credit.fromDate;
    dto.toDate = credit.toDate;

    return dto;
  }
}
