import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreditService } from '../credit/credit.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { Order } from './order.entity';

import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  const orderRepositoryMock = {
    save: jest.fn(),
  };

  const creditServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: CreditService,
          useValue: creditServiceMock,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
