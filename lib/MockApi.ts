import * as Apigateway from '@aws-cdk/aws-apigateway';
import { MockintegrationStack } from "./mockintegration-stack";
import mockJson from './mock.json';
import largeJson from './mock-2.json';
import { MockIntegration } from "@aws-cdk/aws-apigateway";

export default class MockApi {
    static APPLICATION_JSON = "application/json";

    public mockPost = MockApi.createPostMockResponse({
        statusCode: 201, 
        response: `{
            "id": $context.requestId,
            "createdAt": $context.requestTimeEpoch,
            "updatedAt": $context.requestTimeEpoch
          }`
    })

    public mockPostResponse = MockApi.createMockResponse("201");

    public mockGet = MockApi.createGetMockResponse({
        response: `
            #if ($input.params('timestamp') == "2021-01-01 00:00:00")
                ${JSON.stringify(mockJson)}
            #elseif ($input.params('timestamp') == "2021-01-02 00:00:00")
                ${JSON.stringify(largeJson)}
            #else 
                {
                    "failed_order": true
                }
            #end
        `
    });

    public mockGetResponse = MockApi.createMockResponse(
        "200",
        {
            "method.request.querystring.timestamp": true
        }
    );

    // public mockGetAll = MockApi.createGetMockResponse({response: JSON.stringify(mockJson)});

    constructor(stack: MockintegrationStack){
        const mockApi = new Apigateway.RestApi(stack,"mockRestApi", {
            defaultCorsPreflightOptions:{
              allowOrigins: Apigateway.Cors.ALL_ORIGINS,
              allowMethods: Apigateway.Cors.ALL_METHODS
            },
        });
        
        mockApi.root.addMethod(
            "POST",
            this.mockPost,
            this.mockPostResponse
        );
        
        mockApi.root.addMethod(
            "GET",
            this.mockGet,
            this.mockGetResponse
        )
    }

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
            {statusCode = 200, response = `{}`,responseParameters = MockApi.defaultResponseParameters}
        ) : MockIntegration{
        return new Apigateway.MockIntegration({
            passthroughBehavior: Apigateway.PassthroughBehavior.NEVER,
            requestParameters: {
                "integration.request.querystring.timestamp" : "method.request.querystring.timestamp"
            },
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