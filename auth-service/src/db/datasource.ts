import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

export const AuthDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === "test" ? "test_auth_service" : process.env.DB_NAME,
  synchronize: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
});
