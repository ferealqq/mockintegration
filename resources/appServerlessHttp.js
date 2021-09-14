// require('source-map-support/register');
const server = require("./server.js");
const serverless = require("serverless-http");
const express = require("express");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // app.use(function (req, res, next) {
// //     res.header("Access-Control-Allow-Origin", "*");
// //     res.header("Access-Control-Allow-Headers", "*");
// //     res.header("Access-Control-Allow-Methods", "OPTIONS,POST,GET");
// //     res.header("Access-Control-Allow-Credentials", true);
// //     next();
// // });

// app.get("/",(req,res)=>{
//     res.send({
//         name: "Moikka Pekka!"
//     })
// });
const handler = serverless(server);

exports.main = async (event,context) => {
    return await handler(event,context);
};