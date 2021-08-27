import * as Apigateway from '@aws-cdk/aws-apigateway';
import { MockintegrationStack } from "./mockintegration-stack";
import mockJson from './mock.json';
import largeJson from './mock-2.json';
import { MockIntegration } from "@aws-cdk/aws-apigateway";
import MockApi from './MockApi';

// Information about datamapping
//https://docs.aws.amazon.com/apigateway/latest/developerguide/request-response-data-mappings.html
export default class WoocommerceApi {
    public static mockPost = MockApi.createPostMockResponse({
        statusCode: 201,
        response: `{
            "id": $context.requestId,
            "createdAt": $context.requestTimeEpoch,
            "updatedAt": $context.requestTimeEpoch
          }`
    })
    public static mockPostResponse = MockApi.createMockResponse("201");

    public static mockGet = MockApi.createGetMockResponse({
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
        `,
        requestParameters: {
            "integration.request.querystring.timestamp" : "method.request.querystring.timestamp"
        }
    });

    public static mockGetResponse = MockApi.createMockResponse(
        "200",
        {
            "method.request.querystring.timestamp": true
        }
    );

    public static create(stack: MockintegrationStack){
        const mockApi = new Apigateway.RestApi(stack,"mockRestApi", {
            defaultCorsPreflightOptions:{
              allowOrigins: Apigateway.Cors.ALL_ORIGINS,
              allowMethods: Apigateway.Cors.ALL_METHODS
            },
        });
        const api = mockApi.root
                    .addResource("wp-json")
                    .addResource("wc-flashnode");

        const orders = api.addResource("orders");

        orders.addMethod(
          "GET",
          WoocommerceApi.mockGet,
          WoocommerceApi.mockGetResponse
        );

        orders.addMethod(
          "POST",
          WoocommerceApi.mockPost,
          WoocommerceApi.mockPostResponse
        );

        const headerTest = api.addResource("headertest")

        WoocommerceApi.addHeaderTest(headerTest)

        WoocommerceApi.addResponseHeaderTest(headerTest);

    }

    public static addHeaderTest(headerTest : Apigateway.Resource) {
        headerTest.addMethod(
            "GET",
            MockApi.createGetMockResponse({
                response: `
                        {
                            "name": "Pekka Mattinen",
                            "company": "webso",
                            "params.header": "$input.params().header.get('testi')",
                            "headers": {
                                #foreach($param in $input.params().header.keySet())
                                "$param": "$util.escapeJavaScript($input.params().header.get($param))" #if($foreach.hasNext),#end

                                #end
                            },
                        }
                `,
                requestParameters: {
                    "integration.request.header.testi" : "method.request.header.testi"
                }
            }),
            MockApi.createMockResponse(
                "200",
                {
                    "method.request.header.testi": true,
                }
            )
        )
    }

    public static addResponseHeaderTest(headerTest : Apigateway.Resource){
        const mockGetResponderHeaders = new Apigateway.MockIntegration({
            passthroughBehavior: Apigateway.PassthroughBehavior.NEVER,
            requestTemplates: {
              [MockApi.APPLICATION_JSON]: `{
                "statusCode": 200,
              }`,
            },
            integrationResponses: [
              {
                statusCode: "200",
                responseTemplates: {
                    [MockApi.APPLICATION_JSON]: `{
                        "moikka": "hello",
                        "header": {
                            "value": "letsgo"
                        },
                        "headers": {
                            "value": "moneytalks"
                        }
                        #set($context.requestOverride.header.woocommerce-custom-header = "okeitoimiiks?")
                        #set($context.requestOverride.header.value = "okeitoimiiks?")
                    }`,
                },
                responseParameters:{
                    ...MockApi.defaultResponseParameters,
                    "method.response.header.woocommerce-custom-header": "integration.response.header.woocommerce-custom-header",
                    "method.response.header.joku": "integration.response.header.woocommerce-custom-header",
                }
              }
            ],
           }
        );

        headerTest
            .addResource("reponseheader")
            .addMethod(
                "GET",
                mockGetResponderHeaders,
                {
                    methodResponses: [
                      {
                        "statusCode": "200",
                        responseParameters: {
                            "method.response.header.Access-Control-Allow-Origin": true,
                            "method.response.header.Access-Control-Allow-Methods": true,
                            "method.response.header.Access-Control-Allow-Headers": true,
                            "method.response.header.woocommerce-custom-header": true,
                            "method.response.header.joku": true
                        }
                      }
                    ],
                    requestParameters: {
                        "method.request.header.woocommerce-custom-header": true,
                    }
                }
            )

    }
}