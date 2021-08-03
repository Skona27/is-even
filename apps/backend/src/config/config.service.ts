import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config.interface';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get appConfig(): Config['appConfig'] {
    return {
      port: this.configService.get<string>('PORT'),
      version: process.env.npm_package_version,
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
      entities: ['dist/**/*.entity{ .ts,.js}'],
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
}
