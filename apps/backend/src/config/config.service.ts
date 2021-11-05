import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreditLimit } from '../credit/interface/credit-limit.interface';
import { Config } from './config.interface';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get appConfig(): Config['appConfig'] {
    return {
      port: this.configService.get<string>('PORT'),
      version: process.env.npm_package_version,
      cors: true,
    };
  }

  get swaggerConfig(): Config['swaggerConfig'] {
    return {
      title: '@is-even/backend API documentation',
      version: this.appConfig.version,
      description: '',
      enabled: true,
    };
  }

  get databaseConfig(): Config['databaseConfig'] {
    return {
      name: 'default',
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE_NAME'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/**/database/migrations/*.js'],
      synchronize: false,
      migrationsRun: true,
    };
  }

  get awsConfig(): Config['awsConfig'] {
    return {
      region: this.configService.get<string>('AWS_REGION'),
      cognito_userPoolId: this.configService.get<string>(
        'AWS_COGNITO_USER_POOL_ID',
      ),
      cognito_clientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
      cognito_issuer: this.configService.get<string>('AWS_COGNITO_ISSUER'),
    };
  }

  get creditsConfig(): Config['creditsConfig'] {
    return {
      [CreditLimit.Free]: 1000,
      [CreditLimit.Standard]: 1000000,
    };
  }

  get pricesConfig(): Config['pricesConfig'] {
    return {
      [CreditLimit.Free]: 0,
      [CreditLimit.Standard]: 99,
    };
  }

  get stripeConfig(): Config['stripeConfig'] {
    return {
      api_key: this.configService.get<string>('STRIPE_API_KEY'),
      success_url: this.configService.get<string>('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL'),
      webhook_secret: this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
    };
  }
}
