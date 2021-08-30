import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Request,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { OrderService } from '../order/order.service';
import { StripeService } from '../stripe/stripe.service';
import { PaymentService } from './payment.service';

import { Order } from '../order/order.entity';
import { RegisterPaymentDto } from './dto/register-payment.dto';

import { Authorised } from '../auth/auth.decorator';
import { PaymentSession } from './interface/payment-session.interface';
import { RequestWithUser } from '../common/interface/request-with-user.interface';
import { OrderStatus } from '../order/interface/order-status.interface';

import { UnathorizedOrderError } from '../order/error/unathorized-order.error';
import { ReadOrderError } from '../order/error/read-order.error';

import { sessionEventMapper } from './mapper/session-event.mapper';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly orderService: OrderService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('/register')
  @Authorised()
  @ApiCreatedResponse({ description: 'Payment registered' })
  @ApiUnauthorizedResponse({ description: 'Unathorized' })
  @ApiForbiddenResponse({ description: 'Access forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async registerPayment(
    @Body() registerPaymentDto: RegisterPaymentDto,
    @Request() request: RequestWithUser,
  ): Promise<PaymentSession> {
    try {
      const user = request.user;
      const { orderId } = registerPaymentDto;

      const order = await this.orderService.getOrderById(orderId);

      this.orderService.checkOrderOwner(order, user);
      this.orderService.checkOrderFulfillment(order);

      const session = await this.paymentService.registerPayment(order);

      await this.orderService.updateOrderStatus(
        order,
        OrderStatus.PaymentPending,
      );

      return session;
    } catch (error) {
      if (error instanceof ReadOrderError) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      if (error instanceof UnathorizedOrderError) {
        throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/verify')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Payment verified' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  public async verifyPayment(
    @Body() payload: string,
    @Request() request: RequestWithUser,
  ): Promise<string> {
    try {
      const signature = request.headers['stripe-signature'];
      const stripeEvent = await this.stripeService.constructEvent(
        payload,
        signature,
      );
      const event = sessionEventMapper(stripeEvent);

      // TODO: Verify event object and order fulfillment
      console.log(stripeEvent);

      switch (event.type) {
        case 'checkout.session.completed': {
          const order = new Order();
          const paymentProviderId = '';

          await this.paymentService.createPayment(paymentProviderId, order);
          await this.orderService.updateOrderStatus(
            order,
            OrderStatus.PaymentSuccessful,
          );

          await this.orderService.fulfillOrder(order);

          return 'Ok';
        }
        default:
          break;
      }
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
