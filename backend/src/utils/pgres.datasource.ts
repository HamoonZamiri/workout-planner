import dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();

const env = process.env.NODE_ENV;
const nonProd = env === "development" || env === "test";
let database: string;
if (env === "test") {
  database = "test_fitlog_core";
} else if (env === "development") {
  database = "fitlog_core";
} else {
  database = process.env.DB_DATABASE_CORE || "";
}

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;
export const FitlogCoreDataSource = new DataSource({
  type: "postgres",
  host: nonProd ? "localhost" : process.env.FITLOG_CORE_DB_HOST,
  port: nonProd ? 5432 : port,
  username: nonProd ? "postgres" : process.env.DB_USERNAME,
  password: nonProd ? "postgres" : process.env.DB_PASSWORD,
  database: database,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: nonProd,
});

