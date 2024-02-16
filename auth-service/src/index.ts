import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { AuthDataSource } from "./db/datasource";
import AuthRouter from "./routes/auth.routes";
import AppError from "./utils/AppError";
import morgan from "morgan";
dotenv.config();

AuthDataSource.initialize().then(async () => {
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

  app.listen(process.env.PORT || 8081, () => {
    console.log("Listening on port " + (process.env.PORT || 8081));
  });
});
