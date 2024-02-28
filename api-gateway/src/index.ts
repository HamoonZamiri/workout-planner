import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "./middleware";
import constants from "./constants";
dotenv.config();

const app = express();

//app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const authProxy = createProxyMiddleware("/api/auth", {
  changeOrigin: true,
  target: constants.AUTH_SERVICE,
  //onProxyReq: fixRequestBody
});
app.use("/api/auth", authProxy);

app.use(authMiddleware);

const coreProxy = createProxyMiddleware("/api/core", {
  changeOrigin: true,
  target: constants.CORE_SERVICE,
  //onProxyReq: fixRequestBody
});
app.use("/api/core", coreProxy);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}`);
});
