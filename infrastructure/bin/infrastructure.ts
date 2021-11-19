#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';

import { EbsStackProps, EbsStack } from '../lib/ebs-stack';
import { RdsStack } from '../lib/rds-stack';
import { VpcStack } from '../lib/vpc-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { SecurityStack } from '../lib/security-stack';

require('dotenv').config();

const app = new cdk.App();

const region = process.env.REGION || 'eu-central-1';
const stripeApiKey = process.env.STRIPE_API_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeSuccessUrl = process.env.STRIPE_SUCCESS_URL;
const stripeCancelUrl = process.env.STRIPE_CANCEL_URL;
const sentryDsn = process.env.SENTRY_DSN;

const vpcStack = new VpcStack(app, 'vpc-stack');
const cognitoStack = new CognitoStack(app, 'cognito-stack');
const rdsStack = new RdsStack(app, 'rds-stack', { vpc: vpcStack.vpc });
const securityStack = new SecurityStack(app, 'security-stack', {
  vpc: vpcStack.vpc,
});

const ebsEnvironment: EbsStackProps = {
  vpc: vpcStack.vpc,
  awsRegion: app.region || region,
  dbName: rdsStack.name,
  dbHost: rdsStack.host,
  dbPort: rdsStack.port.toString(),
  dbUsername: rdsStack.username,
  dbPassword: rdsStack.password.toString(),
  awsCognitoClientId: cognitoStack.userPoolClientId,
  awsCognitoUserPoolId: cognitoStack.userPoolId,
  ebsInstanceProfileName: securityStack.ebsInstanceProfileName,
  sentryDsn: sentryDsn || '',
  stripeApiKey: stripeApiKey || '',
  stripeCancelUrl: stripeCancelUrl || '',
  stripeSuccessUrl: stripeSuccessUrl || '',
  stripeWebhookSecret: stripeWebhookSecret || '',
};

new EbsStack(app, 'ebs-stack', ebsEnvironment);
