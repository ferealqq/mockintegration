const aws = require("aws-sdk");

exports.main = async function(event, context){
    try{
        const method = event.httpMethod;

        if(method === "GET" && event.path === "/mock-lambda"){
            const data = {
                name: "pekka",
                jotain: true,
                coding: "fun"
            }

            return {
                statusCode: 200,
                body: JSON.stringify(data),
                headers: {
                    ["woocommerce-custom-header"]: "UIDDATA"
                }
            }
        }else if (event.path !== "/" && method === "GET"){
            return {
                statusCode: 400,
                body: `{"error": "path not found"}`,
                headers: {}
            }
        }
    }catch (error){
        return {
            statusCode: 400,
            headers: {},
            body: `{"failed":true}`
        }
    }
}