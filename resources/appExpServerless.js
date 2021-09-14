// require('source-map-support/register');
const serverlessExpress = require("@vendia/serverless-express");
// const server = require("./server.js");
const express = require("express");

const app = express();

app.use(express.json());
// ilman tätä tulee route not found
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    console.log("header configurations");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

app.get("*",(req,res)=>{
    console.log("handling request / ");
    const { event } = serverlessExpress.getCurrentInvoke();
    if(event.Records[0].cf.response.headers['transfer-encoding']){
        res.setHeader(
            'Transfer-Encoding',
            event.Records[0].cf.response.headers['transfer-encoding'][0].value,
        );
    }
    console.log("trying to return");
    res.status(200).send({
        name: "Moikka Pekka!"
    })
});

console.log("so this is only returning something but fails in the node modules");

exports.main = serverlessExpress({app});