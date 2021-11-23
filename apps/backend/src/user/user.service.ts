import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { UserWithAuth } from './interface/user-with-auth.interface';

import { LoggerService } from '../logger/logger.service';
import { CognitoService } from '../cognito/cognito.service';
import { SentryService } from '../sentry/sentry.service';

import { CreateUserError } from './error/create-user.error';
import { LoginUserError } from './error/login-user.error';
import { ReadUserError } from './error/read-user.error';
import { LogoutUserError } from './error/logout-user.error';
import { CognitoCreateUserError } from '../cognito/error/cognito-create-user.error';

@Injectable()
export class UserService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly cognitoService: CognitoService,
    private readonly sentryService: SentryService,
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
    try {
      const user = new User();

      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;

      const authId = await this.cognitoService.createUser(user.email, password);

      user.authId = authId;

      return await this.usersRepository.save(user);
    } catch (error) {
      this.loggerService.error(`Failed to create a new user. ${error.message}`);

      this.sentryService.instance.withScope((scope) => {
        console.log('Sentry');

        scope.setTag('where', 'userService.createUser');
        this.sentryService.instance.captureException(error);
      });

      if (error instanceof CognitoCreateUserError) {
        throw error;
      }

      throw new CreateUserError(error);
    }
  }

  public async loginWithCredentials(
    email: string,
    password: string,
  ): Promise<UserWithAuth> {
    try {
      const auth = await this.cognitoService.login(email, password);
      const user = await this.findUserByEmail(email);

      return {
        user,
        auth,
      };
    } catch (error) {
      this.loggerService.error(
        `Failed to login user with credentials. ${error.message}`,
      );
      throw new LoginUserError(error);
    }
  }

  public async loginWithToken(refreshToken): Promise<UserWithAuth> {
    try {
      const auth = await this.cognitoService.refreshToken(refreshToken);
      const userAuthId = this.cognitoService.getTokenAuthId(auth.accessToken);
      const user = await this.findUserByAuthId(userAuthId);

      return {
        user,
        auth,
      };
    } catch (error) {
      this.loggerService.error(
        `Failed to login user with token. ${error.message}`,
      );
      throw new LoginUserError(error);
    }
  }

  public async logoutUser(email: string): Promise<void> {
    try {
      await this.cognitoService.logout(email);
    } catch (error) {
      this.loggerService.error(`Failed to logout user. ${error.message}`);
      throw new LogoutUserError(error);
    }
  }

  public async findUserByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          email,
        },
      });
    } catch (error) {
      this.loggerService.error(`Failed to read user data. ${error.message}`);
      throw new ReadUserError(error);
    }
  }

  public async findUserByAuthId(authId: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          authId,
        },
      });
    } catch (error) {
      this.loggerService.error(`Failed to read user data. ${error.message}`);
      throw new ReadUserError(error);
    }
  }
}
