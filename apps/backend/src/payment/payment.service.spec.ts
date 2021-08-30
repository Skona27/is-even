import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { StripeService } from '../stripe/stripe.service';
import { LoggerService } from '../logger/logger.service';
import { PaymentService } from './payment.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { Payment } from './payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;

  const paymentRepositoryMock = {
    save: jest.fn(),
  };

  const stripeServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: paymentRepositoryMock,
        },
        {
          provide: StripeService,
          useValue: stripeServiceMock,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
