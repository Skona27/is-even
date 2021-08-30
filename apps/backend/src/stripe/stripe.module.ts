import { Module } from '@nestjs/common';
import { StripeModule as StripePaymentModule } from 'nestjs-stripe';

import { AppConfigModule } from '../config/config.module';
import { AppConfigService } from '../config/config.service';
import { StripeService } from './stripe.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  providers: [StripeService],
  exports: [StripeService],
  imports: [
    AppConfigModule,
    LoggerModule,
    StripePaymentModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          apiKey: configService.stripeConfig.api_key,
          apiVersion: '2020-08-27',
        };
      },
    }),
  ],
})
export class StripeModule {}
