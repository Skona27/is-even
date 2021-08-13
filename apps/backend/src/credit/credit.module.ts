import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreditService } from './credit.service';
import { CreditController } from './credit.controller';
import { LoggerModule } from '../logger/logger.module';
import { Credit } from './credit.entity';
import { AppConfigModule } from '../config/config.module';

@Module({
  providers: [CreditService],
  controllers: [CreditController],
  exports: [CreditService],
  imports: [TypeOrmModule.forFeature([Credit]), LoggerModule, AppConfigModule],
})
export class CreditModule {}
