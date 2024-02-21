import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { authMiddleware } from "./middleware";
dotenv.config();

const app = express();

//app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const authProxy = createProxyMiddleware("/api/auth", {
  changeOrigin: true,
  target: process.env.AUTH_SERVICE,
  //onProxyReq: fixRequestBody
});
app.use("/api/auth", authProxy);

app.use(authMiddleware);

const coreProxy = createProxyMiddleware("/api/core", {
  changeOrigin: true,
  target: process.env.CORE_SERVICE,
  //onProxyReq: fixRequestBody
});
app.use("/api/core", coreProxy);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${process.env.PORT || 8080}`);
});
