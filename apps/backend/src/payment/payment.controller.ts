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

import { RegisterPaymentDto } from './dto/register-payment.dto';

import { Authorised } from '../auth/auth.decorator';
import { PaymentSession } from './interface/payment-session.interface';
import { RequestWithUser } from '../common/interface/request-with-user.interface';

import { UnathorizedOrderError } from '../order/error/unathorized-order.error';
import { ReadOrderError } from '../order/error/read-order.error';

import { sessionEventMapper } from './mapper/session-event.mapper';
import { RequestWithRawBody } from 'src/common/middlewere/webhook-raw-body.middlewere';
import { PaymentStatus } from './interface/payment-status.interface';

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

      await this.paymentService.createPayment(session.id, order);

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
    @Request() request: RequestWithUser & RequestWithRawBody,
  ): Promise<void> {
    try {
      const signature = request.headers['stripe-signature'];

      const stripeEvent = await this.stripeService.constructEvent(
        request.rawBody,
        signature,
      );
      const event = sessionEventMapper(stripeEvent);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data as PaymentSession;
          const payment = await this.paymentService.getPaymentBySessionId(
            session.id,
          );

          await this.paymentService.updatePaymentStatus(
            payment,
            PaymentStatus.Successful,
          );
          await this.orderService.fulfillOrder(payment.order);
        }

        default:
          break;
      }
    } catch (error) {
      console.error(error.message);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
