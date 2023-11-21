import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRouter from "./user/routes/user.routes";
import WorkoutRouter from "./workout/routes/workout.routes";
import AppError from "./utils/AppError";
import { FitlogCoreDataSource } from "./utils/pgres.datasource";
import RoutineRouter from "./routine/routes/routine.routes";
dotenv.config();

FitlogCoreDataSource.initialize()
	.then(async () => {
		const lineSeperator = "----------------------------------------";
		const app = express();

		// middleware
		app.use(express.json());
		app.use(cors());

		app.use((req: Request, _: Response, next: NextFunction) => {
			console.log(lineSeperator);
			console.log(`url: ${req.path}`);
			console.log(`method: ${req.method}`);
			console.log(lineSeperator);
			next();
		});

		// health check
		app.get("/", (_, res) => {
			res.send("Health Check");
		});

		// routes
		app.use("/api/users", UserRouter);
		app.use("/api/workouts", WorkoutRouter);
		app.use("/api/routines", RoutineRouter);

		// error handling
		app.use(
			(
				error: AppError,
				_: Request,
				res: Response,
				__: NextFunction
			): void => {
				console.log(error.message);
				res.status(error.statuscode ? error.statuscode : 400).json({
					error: error.message,
				});
				return;
			}
		);

		app.listen(process.env.PORT || 8081, () => {
			console.log("Listening on port " + process.env.PORT || 8081);
		});
	})
	.catch((error) => console.log(error));
