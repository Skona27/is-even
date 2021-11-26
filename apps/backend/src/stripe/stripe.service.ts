import { Injectable } from '@nestjs/common';
import { InjectStripe } from 'nestjs-stripe';
import { Stripe } from 'stripe';

import { LoggerService } from '../logger/logger.service';
import { AppConfigService } from '../config/config.service';

import { LineItem } from './interface/line-item.interface';

@Injectable()
export class StripeService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectStripe()
    private readonly stripePaymentService: Stripe,
    private readonly configService: AppConfigService,
  ) {
    this.loggerService.setContext(StripeService.name);
  }

  public async createSession(lineItems: LineItem[]) {
    const { cancel_url, success_url } = this.configService.stripeConfig;

    return this.stripePaymentService.checkout.sessions.create({
      line_items: lineItems,
      payment_method_types: ['card'],
      mode: 'payment',
      success_url,
      cancel_url,
    });
  }

  public constructEvent(
    payload: string | Buffer,
    signature: string | string[],
  ) {
    const { webhook_secret } = this.configService.stripeConfig;

    return this.stripePaymentService.webhooks.constructEvent(
      payload,
      signature,
      webhook_secret,
    );
  }
}
