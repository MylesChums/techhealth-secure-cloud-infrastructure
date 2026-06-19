import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface SecurityStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class SecurityStack extends cdk.Stack {
  public readonly ec2Sg: ec2.SecurityGroup;
  public readonly rdsSg: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: SecurityStackProps) {
    super(scope, id, props);

    this.ec2Sg = new ec2.SecurityGroup(this, 'Ec2SecurityGroup', {
      vpc: props.vpc,
      description: 'TechHealth patient portal application server',
      allowAllOutbound: true,
    });

    // SSH only from your IP — replace with your actual IP
    this.ec2Sg.addIngressRule(
      ec2.Peer.ipv4('0.0.0.0/0'),
      ec2.Port.tcp(22),
      'SSH access'
    );

    this.ec2Sg.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'HTTPS patient portal traffic'
    );

    this.rdsSg = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      vpc: props.vpc,
      description: 'TechHealth patient database - no public access',
      allowAllOutbound: false,
    });

    // Only EC2 security group can reach the database
    this.rdsSg.addIngressRule(
      this.ec2Sg,
      ec2.Port.tcp(3306),
      'MySQL from app tier only'
    );
  }
}