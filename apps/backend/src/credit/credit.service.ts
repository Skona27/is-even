import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { addMonths } from 'date-fns';

import { User } from '../user/user.entity';
import { Credit } from './credit.entity';

import { LoggerService } from '../logger/logger.service';
import { AppConfigService } from '../config/config.service';
import { SentryService } from '../sentry/sentry.service';

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
    private readonly sentryService: SentryService,
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
      this.loggerService.error(
        `Failed to read user's credits. ${error.message}`,
      );
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
      this.loggerService.error(
        `Failed to create a new credit. ${error.message}`,
      );

      this.sentryService.instance.withScope((scope) => {
        scope.setTag('where', 'creditService.createCredit');
        scope.setExtra('limit', limit);
        scope.setExtra('duration', duration);
        this.sentryService.instance.captureException(error);
      });

      throw new CreateCreditError(error);
    }
  }

  public async getActiveCredit(user: User): Promise<Credit> {
    try {
      const presentDate = new Date();

      return await this.creditRepository.findOne({
        where: {
          user,
          fromDate: LessThan(presentDate),
          toDate: MoreThan(presentDate),
        },
      });
    } catch (error) {
      this.loggerService.error(
        `Failed to read user's active credit. ${error.message}`,
      );
      throw new ReadActiveCreditError(error);
    }
  }

  public async incrementCreditUsage(credit: Credit): Promise<void> {
    try {
      this.checkLimit(credit);
      credit.incrementUsage();

      this.creditRepository.save(credit);
    } catch (error) {
      this.loggerService.error(`Failed to increment credit. ${error.message}`);
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
      case CreditDuration.Monthly: {
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
      case CreditLimit.Free:
        return creditsConfig.Free;
      case CreditLimit.Standard:
        return creditsConfig.Standard;
      default:
        throw new Error(`Cannot read credit limit value for type ${limit}`);
    }
  }
}
