import dotenv from "dotenv";
import { DataSource } from "typeorm";
import constants from "./constants";
dotenv.config();

export const FitlogCoreDataSource = new DataSource({
  type: "postgres",
  host: constants.DB_HOST,
  port: constants.DB_PORT,
  username: constants.DB_USERNAME,
  password: constants.DB_PASSWORD,
  database: constants.DATABASE,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: constants.nonProd,
});
