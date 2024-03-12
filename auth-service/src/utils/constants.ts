import dotenv from "dotenv";
dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USERNAME = process.env.DB_USERNAME || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
const database =
  process.env.NODE_ENV === "test" ? "test_auth_service" : process.env.DB_NAME;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

const constants = {
  RABBITMQ_URL,
  DB_PASSWORD,
  DB_USERNAME,
  DB_HOST,
  database,
} as const;
export default constants;
