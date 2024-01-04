import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Workout } from "../workout/entities/workout.entity";
import { Routine } from "../routine/entities/routine.entity";
dotenv.config();

const env = process.env.NODE_ENV;
const inDev = env === "development";

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
export const FitlogCoreDataSource = new DataSource({
    type: "postgres",
    host: inDev ? "localhost" : process.env.FITLOG_CORE_DB_HOST,
    port: inDev ? 5432 : port,
    username: inDev ? "postgres" : process.env.DB_USERNAME,
    password: inDev ? "postgres" : process.env.DB_PASSWORD,
    database: inDev ? "fitlog_core" : process.env.DB_DATABASE_CORE,
    entities: [Workout, Routine, User],
    synchronize: process.env.NODE_ENV === "development",
});