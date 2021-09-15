import { LambdaIntegration, RestApi } from "@aws-cdk/aws-apigateway";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { Bucket } from "@aws-cdk/aws-s3";
import { Construct, Stack } from "@aws-cdk/core";

export default class MockLambdaApi {
  public static create(
    mockApi: RestApi,
    stack: Stack,
    {
      lambdaName = "MockLambdaApi",
      handlerMain = "app.main",
      assetsFrom = "resources",
    }
  ) {
    const bucket = new Bucket(stack, lambdaName + "Bucket");

    const handler = new Function(stack, lambdaName + "Handler", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(assetsFrom),
      handler: handlerMain,
      environment: {
        BUCKET: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(handler);

    const func = new NodejsFunction(stack as any, "TypescriptLambdaTest", {
      entry: "lambda-ts/main.ts",
      handler: "handler",
      // for sharing node modules we can probably use
      // buildsArgs? variable or
      // externalModules? variable or
      // commandHooks? variable
      // nodeModules? this is probably the one
      // https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda-nodejs.BundlingOptions.html
      bundling: {
        sourceMap: true,
        minify: true,
        nodeModules: [
          "source-map-support",
          "@types/express",
          "express",
          "@types/compression",
          "compression",
          "@vendia/serverless-express"
        ]
      },
    });

    mockApi.root
      .addResource("typescript")
      .addMethod("ANY", new LambdaIntegration(func as any));
    const apiResource = mockApi.root.addResource(
      "mock-lambda"
      // new ProxyResource(stack,)
    );

    apiResource.addMethod(
      "ANY",
      new LambdaIntegration(
        handler as any
        // {
        //     requestTemplates: { [MockApi.APPLICATION_JSON]: `{"statusCode": "200"}` },
        //     proxy: true
        // }
      )
    );
  }
}
