import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LoggerService } from '../logger/logger.service';
import { StripeService } from '../stripe/stripe.service';
import { SentryService } from '../sentry/sentry.service';

import { Payment } from './payment.entity';
import { Order } from '../order/order.entity';

import { PaymentSession } from './interface/payment-session.interface';
import { SessionEvent } from './interface/session-event.interface';
import { sessionEventMapper } from './mapper/session-event.mapper';

import { RegisterPaymentError } from './error/register-payment.error';
import { ConstructPaymentEventError } from './error/construct-payment-event.error';
import { CreatePaymentError } from './error/create-payment.error';
import { PaymentStatus } from './interface/payment-status.interface';
import { InvalidPaymentStatusError } from './error/invalid-payment-status.error';
import { UpdatePaymentError } from './error/update-payment.error';

@Injectable()
export class PaymentService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly stripeService: StripeService,
    private readonly sentryService: SentryService,
  ) {
    this.loggerService.setContext(PaymentService.name);
  }

  public async registerPayment(order: Order): Promise<PaymentSession> {
    try {
      const price = order.price;

      const session = await this.stripeService.createSession([
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: price,
            product_data: {
              name: `is-even_${order.creditDuration}_${order.creditLimit}`,
            },
          },
        },
      ]);

      return { url: session.url, id: session.id };
    } catch (error) {
      this.loggerService.error(`Failed to register payment. ${error.message}`);

      this.sentryService.instance.withScope((scope) => {
        scope.setTag('where', 'paymentService.registerPayment');
        scope.setExtra('order.id', order.id);
        this.sentryService.instance.captureException(error);
      });

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
      this.loggerService.error(
        `Failed to construct session event. ${error.message}`,
      );

      this.sentryService.instance.withScope((scope) => {
        scope.setTag('where', 'paymentService.constructSessionEvent');
        this.sentryService.instance.captureException(error);
      });

      throw new ConstructPaymentEventError(error);
    }
  }

  public async createPayment(
    sessionId: string,
    order: Order,
  ): Promise<Payment> {
    try {
      const payment = new Payment();

      payment.order = order;
      payment.user = order.user;
      payment.sessionId = sessionId;

      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.loggerService.error(`Failed to create payment. ${error.message}`);
      throw new CreatePaymentError(error);
    }
  }

  public async getPaymentBySessionId(sessionId: string): Promise<Payment> {
    try {
      return await this.paymentRepository.findOneOrFail({
        where: {
          sessionId,
        },
      });
    } catch (error) {
      this.loggerService.error(
        `Failed to get payment by sessionId ${sessionId}. ${error.message}`,
      );
      throw error;
    }
  }

  public async updatePaymentStatus(
    payment: Payment,
    status: PaymentStatus,
  ): Promise<Payment> {
    this.loggerService.log(
      `Updating payment: ${payment.id} with status: ${status}`,
    );

    if (payment.status === status) {
      this.loggerService.error(
        `Cannot update payment status with the exact same value`,
      );
      throw new InvalidPaymentStatusError(
        `Cannot update payment status with the exact same value`,
      );
    }

    if (payment.status === PaymentStatus.Successful) {
      this.loggerService.error(
        `Cannot change the status of successfull payment's`,
      );
      throw new InvalidPaymentStatusError(
        `Cannot change the status of successfull payment's`,
      );
    }

    try {
      payment.status = status;
      return await this.paymentRepository.save(payment);
    } catch (error) {
      this.loggerService.error(
        `Failed to update payment status. ${error.message}`,
      );
      throw new UpdatePaymentError(error.message);
    }
  }
}
