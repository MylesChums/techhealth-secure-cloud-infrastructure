import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { SecurityStack } from '../lib/security-stack';
import { ComputeStack } from '../lib/compute-stack';
import { DatabaseStack } from '../lib/database-stack';

const app = new cdk.App();

const vpcStack = new VpcStack(app, 'TechHealth-Vpc');

const securityStack = new SecurityStack(app, 'TechHealth-Security', {
  vpc: vpcStack.vpc,
});

const computeStack = new ComputeStack(app, 'TechHealth-Compute', {
  vpc: vpcStack.vpc,
  securityGroup: securityStack.ec2Sg,
});

new DatabaseStack(app, 'TechHealth-Database', {
  vpc: vpcStack.vpc,
  securityGroup: securityStack.rdsSg,
});