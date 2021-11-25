import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '../order/order.service';
import { StripeService } from '../stripe/stripe.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { SentryService } from '../sentry/sentry.service';
import { sentryServiceMock } from '../sentry/sentry-service.mock';

describe('PaymentController', () => {
  let controller: PaymentController;

  const stripeServiceMock = {};
  const orderServiceMock = {};
  const paymentServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: StripeService,
          useValue: stripeServiceMock,
        },
        {
          provide: OrderService,
          useValue: orderServiceMock,
        },
        {
          provide: PaymentService,
          useValue: paymentServiceMock,
        },
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: SentryService,
          useValue: sentryServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
