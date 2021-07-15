import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from './config.interface';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get swaggerConfig(): Config['swaggerConfig'] {
    return {
      title: '@is-even/backend API documentation',
      version: '1.0',
      description: '',
      enabled: true,
    };
  }
}
