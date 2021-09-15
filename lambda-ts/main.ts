import "source-map-support/register";
import express from "express";
import compression from "compression";
import serverlessExpress from "@vendia/serverless-express";

export async function handler(event: any, context: any) {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(express.json());
  app.get("*", (req: any, res: any) => {
    res.json({
      pekka: "moikka",
    });
  });
  return serverlessExpress({ app })(event, context);
}
