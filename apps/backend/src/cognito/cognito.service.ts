import { Injectable } from '@nestjs/common';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { InjectAwsService } from 'nest-aws-sdk';
import * as util from 'util';
import jwtDecode from 'jwt-decode';

import { LoggerService } from '../logger/logger.service';
import { AppConfigService } from '../config/config.service';
import { CognitoCreateUserError } from './error/cognito-create-user.error';
import { CognitoUserIdMissingError } from './error/cognito-user-id-missing.error';
import { CognitoLoginUserError } from './error/cognito-login-user.error';
import { TokenResponse } from './interface/auth-response.interface';

@Injectable()
export class CognitoService {
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly authFlow: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: AppConfigService,
    @InjectAwsService(CognitoIdentityServiceProvider)
    private readonly cognitoService: CognitoIdentityServiceProvider,
  ) {
    this.authFlow = 'ADMIN_USER_PASSWORD_AUTH';
    this.userPoolId = this.configService.awsConfig.cognito_userPoolId;
    this.clientId = this.configService.awsConfig.cognito_clientId;
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

  /**
   *
   * @param email
   * @param password
   * @returns RefreshToken, AccessToken, Expiration date
   */
  public async login(email: string, password: string): Promise<TokenResponse> {
    try {
      const response = await this.cognitoService
        .adminInitiateAuth({
          ClientId: this.clientId,
          AuthFlow: this.authFlow,
          UserPoolId: this.userPoolId,
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        })
        .promise();

      if (
        !response.AuthenticationResult.AccessToken ||
        !response.AuthenticationResult.RefreshToken
      ) {
        throw new Error('AccessToken or RefreshToken is missing');
      }

      const accessToken = response.AuthenticationResult.AccessToken;
      const refreshToken = response.AuthenticationResult.RefreshToken;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const expiration = jwtDecode(accessToken).exp as number;

      return {
        accessToken,
        refreshToken,
        expiration,
      };
    } catch (error) {
      this.loggerService.log(`Failed to login user: ${util.inspect(error)}`);
      throw new CognitoLoginUserError(error);
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
