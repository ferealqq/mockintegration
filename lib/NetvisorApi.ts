import { MockintegrationStack } from "./mockintegration-stack";
import * as Apigateway from '@aws-cdk/aws-apigateway';
import MockApi from './MockApi';

export default class NetvisorApi {
    public static create(mockApi: Apigateway.RestApi,stack: MockintegrationStack){
        const netvisorApi = mockApi.root
            .addResource("netvisor")
        
        const customer = netvisorApi.addResource("customer");

        const customerGetIntegration = new Apigateway.MockIntegration({
            passthroughBehavior: Apigateway.PassthroughBehavior.NEVER,
            // requestParameters: MockApi.,
            requestTemplates: {
                "application/xml": ""
            },
            integrationResponses: [
                {
                    statusCode: "200",
                    responseTemplates: {
                        "text/xml": XML_STRING
                    },
                    responseParameters: MockApi.defaultResponseParameters,
                }
            ]
        });


        const customerGetMethodOptions = {
            methodResponses: [
                {
                    "statusCode": "200",
                    responseParameters: {
                        "method.response.header.Access-Control-Allow-Origin": true,
                        "method.response.header.Access-Control-Allow-Methods": true,
                        "method.response.header.Access-Control-Allow-Headers": true
                    }
                }
            ],
            requestParameters: {
                "method.request.querystring.timestamp": true
            }
        }

        customer.addMethod(
            "GET",
            customerGetIntegration,
            customerGetMethodOptions
        );
    }
}


const XML_STRING = `<Root>
<Customer>
<CustomerBaseInformation>
<NetvisorKey>1641</NetvisorKey>
<InternalIdentifier>011</InternalIdentifier>
<ExternalIdentifier>1234567-8</ExternalIdentifier>
<OrganizationUnitNumber>003712345678</OrganizationUnitNumber>
<CustomerGroupNetvisorKey>1</CustomerGroupNetvisorKey>
<CustomerGroupName>Customer group 1</CustomerGroupName>
<Name>Eric Example</Name>
<NameExtension>Example</NameExtension>
<StreetAddress>Example street 1</StreetAddress>
<AdditionalStreetAddress>Appartment #40</AdditionalStreetAddress>
<City>Example</City>
<PostNumber>00000</PostNumber>
<Country type="ISO-3166">FI</Country>
<PhoneNumber>+358401234567</PhoneNumber>
<FaxNumber>123456789</FaxNumber>
<Email>eric.example@exmaple.com</Email>
<HomePageUri>https://netvisor.fi/</HomePageUri>
<IsActive>1</IsActive>
<IsPrivateCustomer>0</IsPrivateCustomer>
<EmailInvoicingAddress>eric.example@example.com</EmailInvoicingAddress>
</CustomerBaseInformation>
<CustomerFinvoiceDetails>
<FinvoiceAddress>123456789</FinvoiceAddress>
<FinvoiceRouterCode>003721291126</FinvoiceRouterCode>
</CustomerFinvoiceDetails>
<CustomerDeliveryDetails>
<DeliveryName>Eric Example</DeliveryName>
<DeliveryStreetAddress>Example street 1</DeliveryStreetAddress>
<DeliveryCity>Example</DeliveryCity>
<DeliveryPostNumber>00000</DeliveryPostNumber>
<DeliveryCountry type="ISO-3166">FI</DeliveryCountry>
</CustomerDeliveryDetails>
<CustomerContactDetails>
<ContactPerson>Eric Example</ContactPerson>
<ContactPersonEmail>eric.example@exmaple.com</ContactPersonEmail>
<ContactPersonPhone>+358401234567</ContactPersonPhone>
</CustomerContactDetails>
<CustomerContactPersons>
<CustomerContactPerson>
<ContactPersonID>1</ContactPersonID>
<ContactPersonFirstName>Tina</ContactPersonFirstName>
<ContactPersonLastName>Tester</ContactPersonLastName>
</CustomerContactPerson>
</CustomerContactPersons>
<CustomerOfficeDetails>
<OfficeNetvisorKey>10</OfficeNetvisorKey>
<OfficeName>Example Office</OfficeName>
<OfficePhoneNumber>+358401234567</OfficePhoneNumber>
<OfficeTelefaxNumber>123456789</OfficeTelefaxNumber>
<OfficeIdentifier>officeidentifier</OfficeIdentifier>
<OfficeContactAddress>
<StreetAddress>Example street 1</StreetAddress>
<AdditionalStreetAddress>Appartment #40</AdditionalStreetAddress>
<PostNumber>00000</PostNumber>
<City>Example</City>
<Country>Example</Country>
</OfficeContactAddress>
<OfficeVisitAddress>
<StreetAddress>Example street 1</StreetAddress>
<AdditionalStreetAddress>Appartment #40</AdditionalStreetAddress>
<PostNumber>00000</PostNumber>
<City>Example</City>
<Country>Example</Country>
</OfficeVisitAddress>
<OfficeFinvoiceDetails>
<FinvoiceAddress>123456789</FinvoiceAddress>
<FinvoiceRouterCode>003721291126</FinvoiceRouterCode>
</OfficeFinvoiceDetails>
</CustomerOfficeDetails>
<CustomerAdditionalInformation>
<Comment>Comment</Comment>
<CustomerAgreementIdentifier>123</CustomerAgreementIdentifier>
<ReferenceNumber>123456</ReferenceNumber>
<YourDefaultReference>987654</YourDefaultReference>
<DefaultTextBeforeInvoiceLines>Text before invoice lines</DefaultTextBeforeInvoiceLines>
<DefaultTextAfterInvoiceLines>Text after invoice lines</DefaultTextAfterInvoiceLines>
<DefaultPaymentTerm NetvisorKey="1">14 päivää netto</DefaultPaymentTerm>
<TaxHandlingType>countrygroup</TaxHandlingType>
<BalanceLimit>1000,55</BalanceLimit>
<DefaultSalesPerson>Sally Seller</DefaultSalesPerson>
<DiscountPercentage>5</DiscountPercentage>
<PriceGroup>5</PriceGroup>
<FactoringAccount NetvisorKey="1">Factoring</FactoringAccount>
<InvoicingLanguage type="ISO-3166">FI</InvoicingLanguage>
<CustomerDimensions>
<Dimension>
<DimensionName NetvisorKey="1">Project</DimensionName>
<DimensionItem Netvisorkey="17">12345</DimensionItem>
</Dimension>
</CustomerDimensions>
</CustomerAdditionalInformation>
</Customer>
</Root>`;