import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { UsageService } from './usage.service';

import { InvalidApiKeyError } from './error/invalid-api-key.error';
import { NoActiveCreditError } from './error/no-active-credit.error';
import { UsedCreditError } from './error/used-credit.error';

@Injectable()
export class UsageGuard implements CanActivate {
  constructor(
    @Inject(UsageService) private readonly usageService: UsageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const apiKey = request.query.apiKey;

      await this.usageService.charge(apiKey);

      return true;
    } catch (error) {
      if (error instanceof InvalidApiKeyError) {
        throw new HttpException('Invalid API Key', HttpStatus.BAD_REQUEST);
      }

      if (error instanceof NoActiveCreditError) {
        throw new HttpException('No active credit', HttpStatus.BAD_REQUEST);
      }

      if (error instanceof UsedCreditError) {
        throw new HttpException('Credit is fully used', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
