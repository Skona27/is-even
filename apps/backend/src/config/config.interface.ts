import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { CreditLimit } from '../credit/interface/credit-limit.interface';

export interface Config {
  appConfig: {
    port: string;
    version: string;
    cors: boolean;
  };
  swaggerConfig: {
    title: string;
    version: string;
    description: string;
    enabled: boolean;
  };
  databaseConfig: TypeOrmModuleOptions;
  awsConfig: {
    region: string;
    cognito_userPoolId: string;
    cognito_clientId: string;
    cognito_issuer: string;
  };
  stripeConfig: {
    api_key: string;
    success_url: string;
    cancel_url: string;
    webhook_secret: string;
  };
  creditsConfig: Record<CreditLimit, number>;
  pricesConfig: Record<CreditLimit, number>;
}
