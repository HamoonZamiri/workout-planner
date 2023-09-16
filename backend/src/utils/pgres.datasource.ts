import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Workout } from "../workout/entities/workout.entity";
import { Routine } from "../routine/entities/routine.entity";
dotenv.config();

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
export const FitlogCoreDataSource = new DataSource({
    type: "postgres",
    host: process.env.FITLOG_CORE_DB_HOST,
    port: port,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_CORE,
    entities: [Workout, Routine],
    synchronize: true
});

export const FitLogUserDataSource = new DataSource({
    type: "postgres",
    host: process.env.FITLOG_CORE_DB_HOST,
    port: port,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_CORE,
    entities: [User],
    synchronize: true
});