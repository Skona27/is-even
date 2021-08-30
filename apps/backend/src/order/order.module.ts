import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { LoggerModule } from '../logger/logger.module';
import { Order } from './order.entity';
import { CreditModule } from '../credit/credit.module';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
  imports: [LoggerModule, CreditModule, TypeOrmModule.forFeature([Order])],
})
export class OrderModule {}
