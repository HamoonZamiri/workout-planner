import { DataSource } from "typeorm";
import { AuthUser } from "../entities/authUser.entity";

export const AuthDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database:
    process.env.NODE_ENV === "test" ? "test_auth_service" : "auth_service",
  synchronize: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
});
