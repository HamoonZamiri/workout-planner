import { DataSource } from "typeorm";
import { AuthUser } from "../entities/authUser.entity";

export const AuthDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "auth_service",
  synchronize: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
});
