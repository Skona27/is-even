import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigService } from '../config/config.service';
import { AppConfigServiceMock } from '../config/config.service.mock';
import { SentryService } from './sentry.service';

describe('SentryService', () => {
  let service: SentryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentryService,
        {
          provide: AppConfigService,
          useValue: AppConfigServiceMock,
        },
      ],
    }).compile();

    service = module.get<SentryService>(SentryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
