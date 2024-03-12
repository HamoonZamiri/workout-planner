import { DataSource } from "typeorm";
import dotenv from "dotenv";
import constants from "../utils/constants";
dotenv.config();

export const AuthDataSource = new DataSource({
  type: "postgres",
  host: constants.DB_HOST,
  port: 5432,
  username: constants.DB_USERNAME,
  password: constants.DB_PASSWORD,
  database:
    process.env.NODE_ENV === "test" ? "test_auth_service" : constants.database,
  synchronize: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
});
