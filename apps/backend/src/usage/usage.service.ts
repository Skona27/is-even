import { Injectable } from '@nestjs/common';

import { ApiKeyService } from '../api-key/api-key.service';
import { CreditService } from '../credit/credit.service';

import { Credit } from '../credit/credit.entity';

import { InvalidApiKeyError } from './error/invalid-api-key.error';
import { NoActiveCreditError } from './error/no-active-credit.error';
import { UsedCreditError } from './error/used-credit.error';

@Injectable()
export class UsageService {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly creditService: CreditService,
  ) {}

  public async charge(apiKey: string): Promise<void> {
    const user = await this.getApiKeyOwner(apiKey);
    const credit = await this.getActiveCredit(user);

    await this.incrementCredit(credit);
  }

  private async getApiKeyOwner(apiKeyValue: string) {
    try {
      const apiKey = await this.apiKeyService.useApiKey(apiKeyValue);
      return apiKey.user;
    } catch (error) {
      throw new InvalidApiKeyError(error);
    }
  }

  private async getActiveCredit(user): Promise<Credit> {
    try {
      return await this.creditService.getActiveCredit(user);
    } catch (error) {
      throw new NoActiveCreditError(error);
    }
  }

  private async incrementCredit(credit: Credit): Promise<void> {
    try {
      await this.creditService.incrementCreditUsage(credit);
    } catch (error) {
      throw new UsedCreditError(error);
    }
  }
}
