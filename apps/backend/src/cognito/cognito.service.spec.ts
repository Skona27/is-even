import { Test, TestingModule } from '@nestjs/testing';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { createAwsServiceMock } from 'nest-aws-sdk/dist/testing';

import { CognitoService } from './cognito.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { AppConfigService } from '../config/config.service';
import { AppConfigServiceMock } from '../config/config.service.mock';

describe('CognitoService', () => {
  let service: CognitoService;

  const cognitoIdentityServiceProviderMock = {
    adminCreateUser: jest.fn(() => ({
      promise: jest.fn(() => Promise.resolve()),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CognitoService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: AppConfigService,
          useValue: AppConfigServiceMock,
        },
        createAwsServiceMock(CognitoIdentityServiceProvider, {
          useValue: cognitoIdentityServiceProviderMock,
        }),
      ],
    }).compile();

    service = module.get<CognitoService>(CognitoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
