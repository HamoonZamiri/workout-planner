import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { AuthDataSource } from "./db/datasource";
import AuthRouter from "./routes/auth.routes";
import AppError from "./utils/AppError";
import morgan from "morgan";
import { connectToRabbit } from "./mq";
dotenv.config();

export default async function initializeApp() {
  await AuthDataSource.initialize();

  const mqService = await connectToRabbit();
  if (!mqService) {
    throw new Error("Failed to connect to RabbitMQ");
  }

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  app.get("/", (_: Request, res: Response) => {
    res.send("Hello World");
  });

  app.use("/api/auth", AuthRouter);

  // global error catcher, controller functions throw errors which are caught here
  app.use((err: AppError, _: Request, res: Response, __: NextFunction) => {
    res.status(err.statuscode || 500).json({
      error: err.message,
    });
  });

  const server = app.listen(process.env.PORT || 8081, () => {
    console.log("Listening on port " + (process.env.PORT || 8081));
  });

  return server;
}
if (process.env.NODE_ENV !== "test") {
  initializeApp();
}
