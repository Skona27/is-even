import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Request,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { OrderService } from './order.service';

import { Authorised } from '../auth/auth.decorator';
import { RequestWithUser } from '../common/interface/request-with-user.interface';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';

import { ReadOrderError } from './error/read-order.error';
import { UnathorizedOrderError } from './error/unathorized-order.error';
import { OrderStatus } from './interface/order-status.interface';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @Authorised()
  @ApiCreatedResponse({ type: OrderDto })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  public async createOrder(
    @Request() request: RequestWithUser,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<OrderDto> {
    try {
      const user = request.user;
      const { creditDuration, creditLimit } = createOrderDto;

      const order = await this.orderService.createOrder(
        creditLimit,
        creditDuration,
        user,
      );

      return OrderDto.createDtoFromEntity(order);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/')
  @Authorised()
  @ApiOkResponse({ type: OrderDto, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  public async getOrders(
    @Request() request: RequestWithUser,
  ): Promise<OrderDto[]> {
    try {
      const user = request.user;

      const orders = await this.orderService.getOrders(user);

      return orders.map(OrderDto.createDtoFromEntity);
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/:id')
  @Authorised()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  public async cancelOrder(
    @Request() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) orderId: string,
  ): Promise<void> {
    try {
      const user = request.user;
      const order = await this.orderService.getOrderById(orderId);

      this.orderService.checkOrderOwner(order, user);
      this.orderService.checkOrderFulfillment(order);

      await this.orderService.updateOrderStatus(order, OrderStatus.Cancelled);
    } catch (error) {
      if (error instanceof UnathorizedOrderError) {
        throw new HttpException('Access forbidden', HttpStatus.FORBIDDEN);
      }
      if (error instanceof ReadOrderError) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
