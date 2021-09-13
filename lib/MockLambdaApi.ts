import { LambdaIntegration, ProxyResource, RestApi } from '@aws-cdk/aws-apigateway';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Bucket } from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import MockApi from './MockApi';

export default class MockLambdaApi{
    public static create(mockApi: RestApi,stack: Stack,{lambdaName = "MockLambdaApi",handlerMain = "app.main", assetsFrom = "resources"}){
        const bucket = new Bucket(stack, lambdaName+"Bucket");

        const handler = new Function(stack,lambdaName+"Handler",{
            runtime: Runtime.NODEJS_10_X,
            code: Code.fromAsset(assetsFrom),
            handler: handlerMain,
            environment: {
                BUCKET: bucket.bucketName
            }
        })

        bucket.grantReadWrite(handler);

        const apiResource = mockApi.root
            .addResource(
                "mock-lambda",
                // new ProxyResource(stack,)
            );

        apiResource.addMethod(
            "ANY",
            new LambdaIntegration(handler as any,
                {
                    requestTemplates: { [MockApi.APPLICATION_JSON]: `{"statusCode": "200"}` },
                    proxy: true 
                }
            )
        );
    }   
}