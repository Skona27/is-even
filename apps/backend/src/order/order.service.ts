import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreditDuration } from '../credit/interface/credit-duration.interface';
import { CreditLimit } from '../credit/interface/credit-limit.interface';
import { OrderStatus } from './interface/order-status.interface';

import { LoggerService } from '../logger/logger.service';
import { CreditService } from '../credit/credit.service';

import { Order } from './order.entity';
import { User } from '../user/user.entity';

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
  ) {
    this.loggerService.setContext(OrderService.name);
  }

  public async createOrder(
    creditLimit: CreditLimit,
    creditDuration: CreditDuration,
    user: User,
  ): Promise<Order> {
    try {
      const price = this.calculateOrderPrice(creditLimit, creditDuration);

      const order = new Order();

      order.status = OrderStatus.Created;
      order.creditDuration = creditDuration;
      order.creditLimit = creditLimit;
      order.price = price;
      order.user = user;

      return await this.orderRepository.save(order);
    } catch (error) {
      this.loggerService.log(`Failed to create a new order. ${error}`);
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
      this.loggerService.log(`Failed to read a orders for a user. ${error}`);
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
      this.loggerService.log(`Failed to read a order. ${error}`);
      throw new ReadOrderError(error);
    }
  }

  public async updateOrderStatus(
    order: Order,
    status: OrderStatus,
  ): Promise<Order> {
    if (order.status === status) {
      this.loggerService.log(
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
      this.loggerService.log(
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
      this.loggerService.log(`Failed to update order status. ${error}`);
      throw new UpdateOrderError(error);
    }
  }

  public async fulfillOrder(order: Order): Promise<Order> {
    try {
      const { creditLimit, creditDuration } = order;

      const credit = await this.creditService.createCredit(
        creditLimit,
        creditDuration,
        order.user,
      );

      order.credit = credit;

      return await this.orderRepository.save(order);
    } catch (error) {
      this.loggerService.log('Failed to fulfill and save order.');
      throw new UpdateOrderError(error);
    }
  }

  public checkOrderOwner(order: Order, user: User): void {
    if (!order.belongsTo(user.id)) {
      this.loggerService.log(`Order does not belong to the user.`);
      throw new UnathorizedOrderError();
    }
  }

  public checkOrderFulfillment(order: Order): void {
    if (
      order.status === OrderStatus.PaymentPending ||
      order.status === OrderStatus.PaymentSuccessful
    ) {
      this.loggerService.log('Order is already fulfilled');
      throw new FulfilledOrderError();
    }
  }

  // TODO: Calculate order price
  private calculateOrderPrice(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _creditLimit: CreditLimit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _creditDuration: CreditDuration,
  ): number {
    return 10;
  }
}
