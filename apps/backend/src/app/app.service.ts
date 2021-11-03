import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly loggerService: LoggerService) {
    this.loggerService.setContext(AppService.name);
  }

  getHello(): string {
    this.loggerService.error('Hello World!');
    return 'Hello World!';
  }
}
