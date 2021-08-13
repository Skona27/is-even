import { Test, TestingModule } from '@nestjs/testing';

import { ApiKeyService } from '../api-key/api-key.service';
import { CreditService } from '../credit/credit.service';
import { UsageService } from './usage.service';

describe('UsageService', () => {
  let service: UsageService;

  const apiKeyServiceMock = {};
  const creditServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsageService,
        {
          provide: ApiKeyService,
          useValue: apiKeyServiceMock,
        },
        {
          provide: CreditService,
          useValue: creditServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsageService>(UsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
