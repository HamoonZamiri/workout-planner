import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import WorkoutRouter from "./workout/routes/workout.routes";
import AppError from "./utils/AppError";
import { FitlogCoreDataSource } from "./utils/pgres.datasource";
import RoutineRouter from "./routine/routes/routine.routes";
import morgan from "morgan";
import amqp from "amqplib";
import constants from "./utils/constants";
import { handleUserCreated } from "./routine/services/routine.service";
dotenv.config();

export async function connectToMQ() {
  try {
    const connection = await amqp.connect(constants.RABBITMQ_URL);
    const channel = await connection.createChannel();
    return { connection, channel };
  } catch (err) {
    console.error(err);
  }
}
export default async function initializeApp() {
  await FitlogCoreDataSource.initialize();
  const connectionResult = await connectToMQ();
  if (connectionResult === undefined) {
    throw new Error("Failed to connect to RabbitMQ");
  }

  const { channel } = connectionResult;
  await channel.assertExchange("user_created", "fanout", { durable: false });
  const assertQueue = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(assertQueue.queue, "user_created", "");

  channel.consume(assertQueue.queue, async (message) => {
    if (message === null) {
      console.log("Null message was received");
      return;
    }
    await handleUserCreated(message);
  });
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
