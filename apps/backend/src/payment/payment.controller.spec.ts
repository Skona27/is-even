import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '../order/order.service';
import { StripeService } from '../stripe/stripe.service';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

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
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
