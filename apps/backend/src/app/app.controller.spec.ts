import { Test, TestingModule } from '@nestjs/testing';

import { UsageService } from '../usage/usage.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  const usageServiceMock = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: UsageService,
          useValue: usageServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });
  });
});
