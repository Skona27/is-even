import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class IsEvenDto {
  @ApiProperty()
  @IsBoolean()
  isEven: boolean;
}
