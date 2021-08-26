import * as cdk from '@aws-cdk/core';
import * as Apigateway from '@aws-cdk/aws-apigateway';
import MockApi from './MockApi';



export class MockintegrationStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here
    const mockApi = new MockApi(this);
  }
}
