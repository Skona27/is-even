import { Injectable } from '@nestjs/common';

import { ApiKeyService } from '../api-key/api-key.service';
import { CreditService } from '../credit/credit.service';

import { Credit } from '../credit/credit.entity';

import { InvalidApiKeyError } from './error/invalid-api-key.error';
import { UsedCreditError } from './error/used-credit.error';
import { CreditLimit } from '../credit/interface/credit-limit.interface';
import { CreditDuration } from '../credit/interface/credit-duration.interface';

@Injectable()
export class UsageService {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly creditService: CreditService,
  ) {}

  public async charge(apiKey: string): Promise<void> {
    const user = await this.getApiKeyOwner(apiKey);

    let credit: Credit;
    credit = await this.getActiveCredit(user);

    if (!credit) {
      credit = await this.createFreeCredit(user);
    }

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
    return await this.creditService.getActiveCredit(user);
  }

  private async createFreeCredit(user): Promise<Credit> {
    return await this.creditService.createCredit(
      CreditLimit.Free,
      CreditDuration.Monthly,
      user,
    );
  }

  private async incrementCredit(credit: Credit): Promise<void> {
    try {
      await this.creditService.incrementCreditUsage(credit);
    } catch (error) {
      throw new UsedCreditError(error);
    }
  }
}
