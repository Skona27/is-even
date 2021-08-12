import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CreditLimit } from '../credit/interface/credit-limit.interface';

export interface Config {
  appConfig: {
    port: string;
    version: string;
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
  creditsConfig: Record<CreditLimit, number>;
}
