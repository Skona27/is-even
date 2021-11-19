import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Credit } from './credit.entity';
import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { LoggerModule } from '../logger/logger.module';
import { AppConfigModule } from '../config/config.module';
import { SentryModule } from '../sentry/sentry.module';

@Module({
  providers: [CreditService],
  controllers: [CreditController],
  exports: [CreditService],
  imports: [
    TypeOrmModule.forFeature([Credit]),
    LoggerModule,
    AppConfigModule,
    SentryModule,
  ],
})
export class CreditModule {}
