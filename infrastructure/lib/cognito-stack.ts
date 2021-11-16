import * as cognito from '@aws-cdk/aws-cognito';
import * as cdk from '@aws-cdk/core';

interface CognitoStackProps extends cdk.StackProps {}

export class CognitoStack extends cdk.Stack {
  public userPoolId: string;
  public userPoolClientId: string;

  constructor(scope: cdk.App, id: string, props?: CognitoStackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'userpool', {
      userPoolName: 'is-even_user-pool',
      selfSignUpEnabled: false,
      signInAliases: {
        username: true,
      },
      autoVerify: {
        email: false,
      },
      standardAttributes: {},
      customAttributes: {},
      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.NONE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'userpool-client', {
      userPool,
      authFlows: {
        adminUserPassword: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    this.userPoolId = userPool.userPoolId;
    this.userPoolClientId = userPoolClient.userPoolClientId;
  }
}
