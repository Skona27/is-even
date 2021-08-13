import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { addMonths } from 'date-fns';

import { User } from '../user/user.entity';
import { Credit } from './credit.entity';

import { LoggerService } from '../logger/logger.service';
import { AppConfigService } from '../config/config.service';

import { CreditLimit } from './interface/credit-limit.interface';
import { CreditDuration } from './interface/credit-duration.interface';

import { ReadCreditError } from './error/read-credit.error';
import { CreateCreditError } from './error/create-credit.error';
import { IncrementCreditError } from './error/increment-credit.error';
import { ReadActiveCreditError } from './error/read-active-credit.error';

@Injectable()
export class CreditService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: AppConfigService,
    @InjectRepository(Credit)
    private readonly creditRepository: Repository<Credit>,
  ) {
    this.loggerService.setContext(CreditService.name);
  }

  public async getCredits(user: User): Promise<Credit[]> {
    try {
      return await this.creditRepository.find({
        where: {
          user,
        },
      });
    } catch (error) {
      this.loggerService.log(`Failed to read user's credits. ${error}`);
      throw new ReadCreditError(error);
    }
  }

  // TODO: Block creating new credit if use still has active one
  public async createCredit(
    limit: CreditLimit,
    duration: CreditDuration,
    user: User,
  ): Promise<Credit> {
    try {
      const credit = new Credit();

      const limitValue = this.getCreditLimitValue(limit);
      const { fromDate, toDate } = this.calculateCreditDuration(duration);

      credit.user = user;
      credit.limit = limitValue;
      credit.fromDate = fromDate;
      credit.toDate = toDate;
      credit.usage = 0;

      return await this.creditRepository.save(credit);
    } catch (error) {
      this.loggerService.log(`Failed to create a new credit. ${error}`);
      throw new CreateCreditError(error);
    }
  }

  public async getActiveCredit(user: User): Promise<Credit> {
    try {
      const presentDate = new Date();

      return await this.creditRepository.findOneOrFail({
        where: {
          user,
          fromDate: LessThan(presentDate),
          toDate: MoreThan(presentDate),
        },
      });
    } catch (error) {
      this.loggerService.log(`No active credit is available. ${error}`);
      throw new ReadActiveCreditError(error);
    }
  }

  public async incrementCreditUsage(credit: Credit): Promise<void> {
    try {
      this.checkLimit(credit);
      credit.incrementUsage();

      this.creditRepository.save(credit);
    } catch (error) {
      this.loggerService.log(`Failed to increment credit. ${error}`);
      throw new IncrementCreditError(error);
    }
  }

  private checkLimit(credit: Credit): void {
    if (credit.isExceeded()) {
      throw new Error(`Credit is exceeded`);
    }
  }

  private calculateCreditDuration(duration: CreditDuration): {
    fromDate: Date;
    toDate: Date;
  } {
    switch (duration) {
      case 'MONTHLY': {
        const fromDate = new Date();
        const toDate = addMonths(fromDate, 1);

        return { fromDate, toDate };
      }
      default:
        throw new Error(
          `Cannot calculate credit duration for type ${duration}`,
        );
    }
  }

  private getCreditLimitValue(limit: CreditLimit): number {
    const creditsConfig = this.configService.creditsConfig;

    switch (limit) {
      case 'FREE':
        return creditsConfig.FREE;
      case 'STANDARD':
        return creditsConfig.STANDARD;
      default:
        throw new Error(`Cannot read credit limit value for type ${limit}`);
    }
  }
}
