import * as Apigateway from '@aws-cdk/aws-apigateway';
import { MockIntegration } from "@aws-cdk/aws-apigateway";

export default class MockApi {
    static APPLICATION_JSON = "application/json";

    public static defaultResponseParameters = {
        "method.response.header.Access-Control-Allow-Methods": "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
        "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        "method.response.header.Access-Control-Allow-Origin": "'*'"
    };

    /**
     * 
     * @param PostResponseSettings 
     * @param PostResponseAdvancedSettings
     * @returns 
     */
    public static createPostMockResponse(
            {statusCode = 201,response = `{}`,responseParameters = MockApi.defaultResponseParameters},
            advancedSettings = {}
        ) : MockIntegration{
        return new Apigateway.MockIntegration({
            passthroughBehavior: Apigateway.PassthroughBehavior.NEVER,
            requestTemplates: {
              [MockApi.APPLICATION_JSON]: `{
                "statusCode": ${statusCode}
              }`        
            },
            integrationResponses: [
              {
                statusCode: statusCode.toString(),
                responseTemplates: {
                  [MockApi.APPLICATION_JSON]: response 
                },
                responseParameters
              }
            ]
           }
        );
    }

    public static createGetMockResponse(
            {statusCode = 200, response = `{}`,responseParameters = MockApi.defaultResponseParameters, requestParameters = {}}
        ) : MockIntegration{
        return new Apigateway.MockIntegration({
            passthroughBehavior: Apigateway.PassthroughBehavior.NEVER,
            requestParameters,
            requestTemplates: {
              [MockApi.APPLICATION_JSON]: `{
                "statusCode": ${statusCode}
              }`        
            },
            integrationResponses: [
              {
                statusCode: statusCode.toString(),
                responseTemplates: {
                  [MockApi.APPLICATION_JSON]: response
                },
                responseParameters
              }
            ]
           }
        );
    
    }

    public static createMockResponse(statusCode: string = "200",requestParameters: any = null){
        return {
            methodResponses: [
              {
                "statusCode": statusCode,
                responseParameters: {
                  "method.response.header.Access-Control-Allow-Origin": true,
                  "method.response.header.Access-Control-Allow-Methods": true,
                  "method.response.header.Access-Control-Allow-Headers": true
                }
              }
            ],
            requestParameters: requestParameters
        };
    }
}