import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ApiKeyService } from './api-key.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { ApiKey } from './api-key.entity';

describe('ApiKeyService', () => {
  let service: ApiKeyService;

  const apiKeyRepositoryMock = {
    save: jest.fn((apiKey: ApiKey) => Promise.resolve(apiKey)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: getRepositoryToken(ApiKey),
          useValue: apiKeyRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
