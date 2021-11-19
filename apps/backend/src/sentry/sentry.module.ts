import { Module } from '@nestjs/common';

import { AppConfigModule } from '../config/config.module';
import { SentryService } from './sentry.service';

@Module({
  imports: [AppConfigModule],
  providers: [SentryService],
  exports: [SentryService],
})
export class SentryModule {}
