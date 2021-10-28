import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Request,
  Body,
  Get,
  Delete,
  ParseUUIDPipe,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { RequestWithUser } from '../common/interface/request-with-user.interface';
import { Authorised } from '../auth/auth.decorator';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { ApiKeyDto } from './dto/api-key.dto';
import { NotFoundApiKeyError } from './error/not-found-api-key.error';
import { UnathorizedApiKeyError } from './error/unathorized-api-key.error';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post('/')
  @Authorised()
  @ApiTags('api-keys')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'API Key has been successfully created',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request',
  })
  public async createApiKey(
    @Request() request: RequestWithUser,
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<ApiKeyDto> {
    try {
      const user = request.user;
      const name = createApiKeyDto.name;

      const apiKey = await this.apiKeyService.createApiKey(name, user);
      return ApiKeyDto.createFromApiKey(apiKey);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/')
  @Authorised()
  @ApiTags('api-keys')
  @ApiResponse({
    type: ApiKeyDto,
    isArray: true,
    status: HttpStatus.OK,
    description: 'API Key has been successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  public async getApiKeys(
    @Request() request: RequestWithUser,
  ): Promise<ApiKeyDto[]> {
    try {
      const user = request.user;
      const apiKeys = await this.apiKeyService.readApiKeys(user);

      return apiKeys.map((key) => ApiKeyDto.createFromApiKey(key));
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @Authorised()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiTags('api-keys')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'API Key has been successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'API Key not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access forbidden',
  })
  public async deleteApiKey(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() request: RequestWithUser,
  ): Promise<void> {
    try {
      const user = request.user;
      return await this.apiKeyService.deleteApiKey(id, user);
    } catch (error) {
      if (error instanceof NotFoundApiKeyError) {
        throw new HttpException('API Key not found', HttpStatus.NOT_FOUND);
      }

      if (error instanceof UnathorizedApiKeyError) {
        throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
