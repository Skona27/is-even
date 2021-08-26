import {
  Controller,
  Post,
  HttpStatus,
  HttpException,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { Authorised } from '../auth/auth.decorator';
import { RequestWithUser } from '../common/interface/request-with-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  @Authorised()
  @ApiCreatedResponse()
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
  @ApiOkResponse()
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
}
