import {
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
  IsDate,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiKey } from '../api-key.entity';

export class ApiKeyDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty()
  @IsString()
  @MinLength(50)
  @MaxLength(50)
  value: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  lastUsed?: Date;

  public static createFromApiKey(apiKey: ApiKey): ApiKeyDto {
    const dto = new ApiKeyDto();

    dto.id = apiKey.id;
    dto.name = apiKey.name;
    dto.value = apiKey.value;
    dto.createdAt = apiKey.createdAt;
    dto.lastUsed = apiKey.lastUsed;

    return dto;
  }
}
