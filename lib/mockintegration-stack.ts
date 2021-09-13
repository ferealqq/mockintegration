import * as cdk from '@aws-cdk/core';
import * as Apigateway from '@aws-cdk/aws-apigateway';
import MockApi from './MockApi';
import WoocommerceApi from './WoocommerceMockApi';
import MockLambdaApi from './MockLambdaApi'
import NetvisorApi from './NetvisorApi';

export class MockintegrationStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const mockApi = new Apigateway.RestApi(this,"mockRestApi", {
      defaultCorsPreflightOptions:{
        allowOrigins: Apigateway.Cors.ALL_ORIGINS,
        allowMethods: Apigateway.Cors.ALL_METHODS
      },
    });

    // The code that defines your stack goes here
    WoocommerceApi.create(mockApi,this);

    MockLambdaApi.create(mockApi,this,{});    

    NetvisorApi.create(mockApi,this);
  }
}
