import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';

import { LoggerService } from '../logger/logger.service';
import { AppConfigService } from '../config/config.service';
import { CognitoCreateUserError } from './error/cognito-create-user.error';
import { CognitoUserIdMissingError } from './error/cognito-user-id-missing.error';

@Injectable()
export class CognitoService {
  private readonly userPoolId: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: AppConfigService,
    @InjectAwsService(CognitoIdentityServiceProvider)
    private readonly cognitoService: CognitoIdentityServiceProvider,
  ) {
    this.userPoolId = this.configService.awsConfig.cognito_userPoolId;
  }

  /**
   *
   * @param email
   * @param password
   * @returns User ID
   */
  public async createUser(email: string, password: string): Promise<string> {
    try {
      const response = await this.cognitoService
        .adminCreateUser({
          UserPoolId: this.userPoolId,
          Username: email,
        })
        .promise();

      await this.cognitoService
        .adminSetUserPassword({
          UserPoolId: this.userPoolId,
          Username: email,
          Password: password,
          Permanent: true,
        })
        .promise();

      return this.getUserId(response.User);
    } catch (error) {
      this.loggerService.log(`Failed to create a new user. ${error}`);
      throw new CognitoCreateUserError(error);
    }
  }

  private getUserId(user: CognitoIdentityServiceProvider.UserType): string {
    const userId = user.Attributes.find((attr) => attr.Name === 'sub').Value;

    if (!userId) {
      this.loggerService.log('User ID is missing but cannot be undefined');
      throw new CognitoUserIdMissingError();
    }

    return userId;
  }
}
