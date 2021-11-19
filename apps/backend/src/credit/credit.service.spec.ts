import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { sentryServiceMock } from '../sentry/sentry-service.mock';
import { SentryService } from '../sentry/sentry.service';
import { AppConfigService } from '../config/config.service';
import { AppConfigServiceMock } from '../config/config.service.mock';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';

import { Credit } from './credit.entity';
import { CreditService } from './credit.service';

describe('CreditService', () => {
  let service: CreditService;

  const creditRepositoryMock = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: AppConfigService,
          useValue: AppConfigServiceMock,
        },
        {
          provide: getRepositoryToken(Credit),
          useValue: creditRepositoryMock,
        },
        {
          provide: SentryService,
          useValue: sentryServiceMock,
        },
      ],
    }).compile();

    service = module.get<CreditService>(CreditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
