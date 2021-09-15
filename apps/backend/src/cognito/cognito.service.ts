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
import { CognitoLogoutUserError } from './error/cognito-logout-user.error';

@Injectable()
export class CognitoService {
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: AppConfigService,
    @InjectAwsService(CognitoIdentityServiceProvider)
    private readonly cognitoService: CognitoIdentityServiceProvider,
  ) {
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
          AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
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
      const expiration = this.getTokenExpiration(accessToken);

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

  public async refreshToken(token: string): Promise<TokenResponse> {
    try {
      const response = await this.cognitoService
        .adminInitiateAuth({
          ClientId: this.clientId,
          UserPoolId: this.userPoolId,
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          AuthParameters: { REFRESH_TOKEN: token },
        })
        .promise();

      if (!response.AuthenticationResult.AccessToken) {
        throw new Error('AccessToken is missing');
      }

      const refreshToken = token;
      const accessToken = response.AuthenticationResult.AccessToken;
      const expiration = this.getTokenExpiration(accessToken);

      return {
        accessToken,
        refreshToken,
        expiration,
      };
    } catch (error) {
      this.loggerService.log(`Failed to refresh token: ${util.inspect(error)}`);
      throw new CognitoLoginUserError(error);
    }
  }

  public async logout(email: string): Promise<void> {
    try {
      await this.cognitoService
        .adminUserGlobalSignOut({
          Username: email,
          UserPoolId: this.userPoolId,
        })
        .promise();
    } catch (error) {
      this.loggerService.log(`Failed to logout user: ${util.inspect(error)}`);
      throw new CognitoLogoutUserError(error);
    }
  }

  public getTokenEmail(accessToken: string): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return jwtDecode(accessToken).username;
  }

  private getUserId(user: CognitoIdentityServiceProvider.UserType): string {
    const userId = user.Attributes.find((attr) => attr.Name === 'sub').Value;

    if (!userId) {
      this.loggerService.log('User ID is missing but cannot be undefined');
      throw new CognitoUserIdMissingError();
    }

    return userId;
  }

  private getTokenExpiration(accessToken: string): number {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return jwtDecode(accessToken).exp;
  }
}
