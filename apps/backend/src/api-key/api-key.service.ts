import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { User } from '../user/user.entity';
import { ApiKey } from './api-key.entity';
import { LoggerService } from '../logger/logger.service';

import { CreateApiKeyError } from './error/create-api-key.error';
import { ReadApiKeyError } from './error/read-api-key.error';
import { DeleteApiKeyError } from './error/delete-api-key.error';
import { UnathorizedApiKeyError } from './error/unathorized-api-key.error';
import { NotFoundApiKeyError } from './error/not-found-api-key.error';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {
    this.loggerService.setContext(ApiKeyService.name);
  }

  public async createApiKey(name: string, user: User): Promise<ApiKey> {
    try {
      const apiKey = new ApiKey();

      apiKey.user = user;
      apiKey.name = name;
      apiKey.value = this.generateRandomValue(50);

      return await this.apiKeyRepository.save(apiKey);
    } catch (error) {
      this.loggerService.log(`Failed to create a new API key. ${error}`);
      throw new CreateApiKeyError(error);
    }
  }

  public async readApiKeys(user: User): Promise<ApiKey[]> {
    try {
      return await this.apiKeyRepository.find({
        where: {
          user,
        },
      });
    } catch (error) {
      this.loggerService.log(`Failed to read API keys. ${error}`);
      throw new ReadApiKeyError(error);
    }
  }

  public async deleteApiKey(apiKeyId: string, user: User): Promise<void> {
    let apiKey: ApiKey;

    try {
      apiKey = await this.findApiKeyById(apiKeyId);
    } catch (error) {
      this.loggerService.log(`Failed to read API key. ${error}`);
      throw new DeleteApiKeyError(error);
    }

    if (!apiKey) {
      throw new NotFoundApiKeyError();
    }

    if (!apiKey.belongsTo(user.id)) {
      throw new UnathorizedApiKeyError();
    }

    try {
      await this.apiKeyRepository.delete({ id: apiKeyId });
    } catch (error) {
      this.loggerService.log(`Failed to delete API key. ${error}`);
      throw new DeleteApiKeyError(error);
    }
  }

  public async useApiKey(apiKeyValue: string): Promise<ApiKey> {
    try {
      const apiKey = await this.apiKeyRepository.findOneOrFail({
        where: {
          value: apiKeyValue,
        },
      });

      apiKey.lastUsed = new Date();

      await this.apiKeyRepository.save(apiKey);

      return apiKey;
    } catch (error) {
      this.loggerService.log(`Failed to fetch owner of API key. ${error}`);
      throw new NotFoundApiKeyError();
    }
  }

  private async findApiKeyById(apiKeyId: string): Promise<ApiKey> {
    return await this.apiKeyRepository.findOne({ id: apiKeyId });
  }

  private generateRandomValue(length = 50): string {
    return crypto.randomBytes(length / 2).toString('hex');
  }
}
