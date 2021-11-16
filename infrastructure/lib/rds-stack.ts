import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';

export interface RdsStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class RdsStack extends cdk.Stack {
  public readonly instance: rds.DatabaseInstance;

  public readonly port = 5432;
  public readonly name = 'iseven';
  public readonly username = 'postgres';

  public readonly password: cdk.SecretValue;
  public readonly host: string;

  constructor(scope: cdk.Construct, id: string, props: RdsStackProps) {
    super(scope, id, props);

    const databaseCredentialsSecret = new secretsmanager.Secret(
      this,
      'database-credentials',
      {
        secretName: 'database-credentials',
        generateSecretString: {
          includeSpace: false,
          excludePunctuation: true,
          generateStringKey: 'password',
          secretStringTemplate: JSON.stringify({
            username: this.username,
          }),
        },
      },
    );

    this.password = databaseCredentialsSecret.secretValueFromJson('password');

    this.instance = new rds.DatabaseInstance(this, 'database', {
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_13_4,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO,
      ),
      databaseName: this.name,
      credentials: {
        username: this.username,
        password: this.password,
      },
      storageType: rds.StorageType.GP2,
      allocatedStorage: 10,
      allowMajorVersionUpgrade: false,
      autoMinorVersionUpgrade: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
      publiclyAccessible: false,
      port: this.port,
    });

    this.host = this.instance.instanceEndpoint.hostname.toString();

    this.instance.connections.allowDefaultPortFromAnyIpv4();
  }
}
