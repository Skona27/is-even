import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../logger/logger.service';
import { StripeService } from '../stripe/stripe.service';

import { Payment } from './payment.entity';
import { Order } from '../order/order.entity';

import { PaymentSession } from './interface/payment-session.interface';
import { SessionEvent } from './interface/session-event.interface';
import { sessionEventMapper } from './mapper/session-event.mapper';

import { RegisterPaymentError } from './error/register-payment.error';
import { ConstructPaymentEventError } from './error/construct-payment-event.error';
import { CreatePaymentError } from './error/create-payment.error';

@Injectable()
export class PaymentService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService,
  ) {
    this.loggerService.setContext(PaymentService.name);
  }

  public async registerPayment(order: Order): Promise<PaymentSession> {
    try {
      const price = order.price.toString();
      const name = `${order.creditLimit} ${order.creditDuration}`;

      const session = await this.stripeService.createSession([
        { quantity: 1, price, name },
      ]);

      return { url: session.url };
    } catch (error) {
      this.loggerService.log(`Failed to register payment. ${error}`);
      throw new RegisterPaymentError(error);
    }
  }

  public async constructSessionEvent(
    payload: string,
    signature: string,
  ): Promise<SessionEvent> {
    try {
      const stripeEvent = await this.stripeService.constructEvent(
        payload,
        signature,
      );
      return sessionEventMapper(stripeEvent);
    } catch (error) {
      this.loggerService.log(`Failed to construct session event. ${error}`);
      throw new ConstructPaymentEventError(error);
    }
  }

  public async createPayment(
    paymentProviderId: string,
    order: Order,
  ): Promise<Payment> {
    try {
      const payment = new Payment();

      payment.order = order;
      payment.user = order.user;
      payment.paymentProviderId = paymentProviderId;

      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.loggerService.log(`Failed to create payment. ${error}`);
      throw new CreatePaymentError(error);
    }
  }
}
