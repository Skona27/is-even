import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
