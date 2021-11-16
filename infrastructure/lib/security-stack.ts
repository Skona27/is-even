import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

export interface SecurityStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class SecurityStack extends cdk.Stack {
  readonly ebsInstanceProfileName = 'ebs-instance-profile';

  constructor(scope: cdk.Construct, id: string, props: SecurityStackProps) {
    super(scope, id, props);

    this.setEbsRoles();
  }

  private setEbsRoles() {
    const role = new iam.Role(this, 'ebs-role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier'),
    );

    role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['*'],
      }),
    );

    new iam.CfnInstanceProfile(this, this.ebsInstanceProfileName, {
      instanceProfileName: this.ebsInstanceProfileName,
      roles: [role.roleName],
    });
  }
}
