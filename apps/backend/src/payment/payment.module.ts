import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';

import { LoggerModule } from '../logger/logger.module';
import { StripeModule } from '../stripe/stripe.module';
import { OrderModule } from '../order/order.module';

@Module({
  providers: [PaymentService],
  controllers: [PaymentController],
  imports: [
    LoggerModule,
    StripeModule,
    OrderModule,
    TypeOrmModule.forFeature([Payment]),
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
