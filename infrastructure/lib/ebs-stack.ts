import * as cdk from '@aws-cdk/core';
import * as EB from '@aws-cdk/aws-elasticbeanstalk';
import * as S3Assets from '@aws-cdk/aws-s3-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';

export interface EbsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  awsRegion: string;
  dbUsername: string;
  dbPassword: string;
  dbHost: string;
  dbPort: string;
  dbName: string;
  stripeWebhookSecret: string;
  stripeApiKey: string;
  stripeSuccessUrl: string;
  stripeCancelUrl: string;
  awsCognitoClientId: string;
  awsCognitoUserPoolId: string;
  ebsInstanceProfileName: string;
}

export class EbsStack extends cdk.Stack {
  public readonly applicationName = 'is-even_backend';

  constructor(scope: cdk.App, id: string, props: EbsStackProps) {
    super(scope, id, props);

    const appVersionProps = this.getAppVersionProps();
    const environmentVariables = this.getEnvironmentVariables(props);

    const application = new EB.CfnApplication(
      this,
      `${this.applicationName}-app`,
      {
        applicationName: this.applicationName,
      },
    );

    const options: EB.CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'IamInstanceProfile',
        value: props.ebsInstanceProfileName,
      },
      {
        namespace: 'aws:ec2:instances',
        optionName: 'InstanceTypes',
        value: 't2.micro',
      },
      {
        namespace: 'aws:elasticbeanstalk:environment',
        optionName: 'EnvironmentType',
        value: 'LoadBalanced',
      },
      {
        namespace: 'aws:elasticbeanstalk:environment',
        optionName: 'LoadBalancerType',
        value: 'application',
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MinSize',
        value: '1',
      },
      {
        namespace: 'aws:autoscaling:asg',
        optionName: 'MaxSize',
        value: '1',
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'VPCId',
        value: props.vpc.vpcId,
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'Subnets',
        value: props.vpc.publicSubnets.map((value) => value.subnetId).join(','),
      },
    ];

    new EB.CfnEnvironment(this, `${this.applicationName}-environment`, {
      environmentName: 'production',
      applicationName: application.applicationName || this.applicationName,
      solutionStackName: '64bit Amazon Linux 2 v5.2.3 running Node.js 12',
      optionSettings: [...options, ...environmentVariables],
      versionLabel: appVersionProps.ref,
    });

    appVersionProps.addDependsOn(application);
  }

  private getEnvironmentVariables(props: EbsStackProps) {
    const environmentVariables: Record<string, any> = {
      DB_HOST: props.dbHost,
      DB_PORT: props.dbPort,
      DB_PASSWORD: props.dbPassword,
      DB_USERNAME: props.dbUsername,
      DB_DATABASE_NAME: props.dbName,
      AWS_REGION: props.awsRegion,
      AWS_COGNITO_USER_POOL_ID: props.awsCognitoUserPoolId,
      AWS_COGNITO_CLIENT_ID: props.awsCognitoClientId,
      AWS_COGNITO_ISSUER: `https://cognito-idp.${props.awsRegion}.amazonaws.com/${props.awsCognitoUserPoolId}`,
      STRIPE_API_KEY: props.stripeApiKey,
      STRIPE_SUCCESS_URL: props.stripeSuccessUrl,
      STRIPE_CANCEL_URL: props.stripeCancelUrl,
      STRIPE_WEBHOOK_SECRET: props.stripeWebhookSecret,
    };

    return Object.keys(environmentVariables).map((variable) => {
      return {
        namespace: 'aws:elasticbeanstalk:application:environment',
        optionName: variable,
        value: environmentVariables[variable],
      };
    });
  }

  private getAppVersionProps() {
    const assets = new S3Assets.Asset(this, `${this.applicationName}-assets`, {
      path: '../apps/backend/dist',
    });

    return new EB.CfnApplicationVersion(
      this,
      `${this.applicationName}-version`,
      {
        applicationName: this.applicationName,
        sourceBundle: {
          s3Bucket: assets.s3BucketName,
          s3Key: assets.s3ObjectKey,
        },
      },
    );
  }
}
