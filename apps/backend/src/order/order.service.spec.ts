import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { sentryServiceMock } from '../sentry/sentry-service.mock';
import { SentryService } from '../sentry/sentry.service';
import { AppConfigService } from '../config/config.service';
import { AppConfigServiceMock } from '../config/config.service.mock';
import { CreditService } from '../credit/credit.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { OrderService } from './order.service';
import { Order } from './order.entity';

describe('OrderService', () => {
  let service: OrderService;

  const orderRepositoryMock = {
    save: jest.fn(),
  };

  const creditServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: CreditService,
          useValue: creditServiceMock,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepositoryMock,
        },
        {
          provide: AppConfigService,
          useValue: AppConfigServiceMock,
        },
        {
          provide: SentryService,
          useValue: sentryServiceMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
