import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import WorkoutRouter from "./workout/routes/workout.routes";
import AppError from "./utils/AppError";
import { FitlogCoreDataSource } from "./utils/pgres.datasource";
import RoutineRouter from "./routine/routes/routine.routes";
import morgan from "morgan";
dotenv.config();

export default async function initializeApp() {
  await FitlogCoreDataSource.initialize();
  const app = express();

  // middleware
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  // health check
  app.get("/", (_, res) => {
    res.send("Health Check");
  });

  // routes
  // app.use("/api/users", UserRouter);
  app.use("/api/core/workout", WorkoutRouter);
  app.use("/api/core/routine", RoutineRouter);

  // error handling
  app.use(
    (error: AppError, _: Request, res: Response, __: NextFunction): void => {
      console.log(error.message);
      res.status(error.statuscode ? error.statuscode : 500).json({
        error: error.message,
      });
      return;
    },
  );

  const server = app.listen(process.env.PORT || 8081, () => {
    console.log("Listening on port " + process.env.PORT || 8081);
  });
  return server;
}

if (process.env.NODE_ENV !== "test") {
  initializeApp();
}
