import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { LoggerService } from '../logger/logger.service';
import { CognitoService } from '../cognito/cognito.service';
import { CreateUserError } from './error/create-user.error';

@Injectable()
export class UserService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly cognitoService: CognitoService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {
    this.loggerService.setContext(UserService.name);
  }

  public async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    const authId = await this.cognitoService.createUser(user.email, password);

    user.authId = authId;

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      this.loggerService.log(`Failed to create a new user. ${error}`);
      throw new CreateUserError(error);
    }
  }
}
