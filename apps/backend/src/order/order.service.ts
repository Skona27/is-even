import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreditDuration } from '../credit/interface/credit-duration.interface';
import { CreditLimit } from '../credit/interface/credit-limit.interface';
import { OrderStatus } from './interface/order-status.interface';

import { LoggerService } from '../logger/logger.service';
import { CreditService } from '../credit/credit.service';
import { AppConfigService } from '../config/config.service';
import { SentryService } from '../sentry/sentry.service';

import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { Credit } from '../credit/credit.entity';

import { UnathorizedOrderError } from './error/unathorized-order.error';
import { CreateOrderError } from './error/create-order.error';
import { ReadOrderError } from './error/read-order.error';
import { UpdateOrderError } from './error/update-order.error';
import { InvalidOrderStatusError } from './error/invalid-order-status.error';
import { FulfilledOrderError } from './error/fulfilled-order.error';

@Injectable()
export class OrderService {
  constructor(
    private readonly loggerService: LoggerService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly creditService: CreditService,
    private readonly configService: AppConfigService,
    private readonly sentryService: SentryService,
  ) {
    this.loggerService.setContext(OrderService.name);
  }

  public async createOrder(
    creditLimit: CreditLimit,
    creditDuration: CreditDuration,
    user: User,
  ): Promise<Order> {
    try {
      await this.checkOrderCreateConditions(user);

      const price = this.calculateOrderPrice(creditLimit);

      const order = new Order();

      order.status = OrderStatus.Created;
      order.creditDuration = creditDuration;
      order.creditLimit = creditLimit;
      order.price = price;
      order.user = user;

      return await this.orderRepository.save(order);
    } catch (error) {
      this.loggerService.error(
        `Failed to create a new order. ${error.message}`,
      );

      this.sentryService.instance.withScope((scope) => {
        scope.setTag('where', 'orderService.createOrder');
        scope.setExtra('creditLimit', creditLimit);
        scope.setExtra('creditDuration', creditDuration);
        this.sentryService.instance.captureException(error);
      });

      throw new CreateOrderError(error);
    }
  }

  public async getOrders(user: User): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: {
          user,
        },
      });
    } catch (error) {
      this.loggerService.error(
        `Failed to read a orders for a user. ${error.message}`,
      );
      throw new ReadOrderError(error);
    }
  }

  public async getOrderById(id: string): Promise<Order> {
    try {
      return await this.orderRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (error) {
      this.loggerService.error(`Failed to read a order. ${error.message}`);
      throw new ReadOrderError(error);
    }
  }

  public async updateOrderStatus(
    order: Order,
    status: OrderStatus,
  ): Promise<Order> {
    if (order.status === status) {
      this.loggerService.error(
        `Cannot update order status with the exact same value`,
      );
      throw new InvalidOrderStatusError(
        `Cannot update order status with the exact same value`,
      );
    }

    if (
      status === OrderStatus.Created &&
      order.status !== OrderStatus.Created
    ) {
      this.loggerService.error(
        `Cannot change the order's status to Created again`,
      );
      throw new InvalidOrderStatusError(
        `Cannot change the order's status to Created again`,
      );
    }

    order.status = status;

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      this.loggerService.error(
        `Failed to update order status. ${error.message}`,
      );
      throw new UpdateOrderError(error);
    }
  }

  public async fulfillOrder(order: Order): Promise<Order> {
    try {
      this.loggerService.log(`Fulfilling order: ${order.id}`);

      const { creditLimit, creditDuration } = order;

      const credit = await this.creditService.createCredit(
        creditLimit,
        creditDuration,
        order.user,
      );

      order.credit = credit;
      order.status = OrderStatus.Fulfilled;

      return await this.orderRepository.save(order);
    } catch (error) {
      this.loggerService.error('Failed to fulfill and save order.');
      throw new UpdateOrderError(error);
    }
  }

  public checkOrderOwner(order: Order, user: User): void {
    if (!order.belongsTo(user.id)) {
      this.loggerService.error(`Order does not belong to the user.`);
      throw new UnathorizedOrderError();
    }
  }

  public checkOrderFulfillment(order: Order): void {
    if (order.status === OrderStatus.Fulfilled) {
      this.loggerService.error('Order is already fulfilled');
      throw new FulfilledOrderError();
    }
  }

  private async checkOrderCreateConditions(user: User): Promise<void> {
    let credit: Credit;

    try {
      credit = await this.creditService.getActiveCredit(user);
    } catch {}

    if (credit) {
      throw new Error('User has active credit');
    }
  }

  private calculateOrderPrice(limit: CreditLimit): number {
    const creditsConfig = this.configService.pricesConfig;

    switch (limit) {
      case CreditLimit.Free:
        return creditsConfig.Free;
      case CreditLimit.Standard:
        return creditsConfig.Standard;
      default:
        throw new Error(`Cannot calculate price for limit type ${limit}`);
    }
  }
}
