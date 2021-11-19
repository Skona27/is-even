import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Integrations } from '@sentry/tracing';

import { AppConfigService } from '../config/config.service';

@Injectable()
export class SentryService {
  public readonly instance: typeof Sentry;

  constructor(private readonly configService: AppConfigService) {
    const { appConfig, sentryConfig } = this.configService;

    Sentry.init({
      dsn: sentryConfig.dsn,
      release: appConfig.version,
      environment: appConfig.environment,
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 0.5,
    });

    this.instance = Sentry;
  }
}
