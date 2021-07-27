import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceMock } from '../logger/logger.service.mock';
import { CognitoService } from '../cognito/cognito.service';

describe('UserService', () => {
  let service: UserService;

  const userRepositoryMock = {
    save: jest.fn((user: User) => Promise.resolve(user)),
  };

  const cognitoServiceMock = {
    createUser: jest.fn((user) => Promise.resolve(user)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: LoggerService,
          useValue: LoggerServiceMock,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepositoryMock,
        },
        {
          provide: CognitoService,
          useValue: cognitoServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
