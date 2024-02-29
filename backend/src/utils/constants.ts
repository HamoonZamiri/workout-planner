import dotenv from "dotenv";
dotenv.config();

const env = process.env.NODE_ENV;
let database: string;
if (env === "test") {
  database = "test_fitlog_core";
} else if (env === "development") {
  database = "fitlog_core";
} else {
  database = process.env.DB_DATABASE_CORE || "";
}

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_TYPE = "postgres";
const nonProd = env === "development" || env === "test";
const DB_USERNAME = process.env.DB_USERNAME || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

const HTTP = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

const CORE_SERVICE_URL = process.env.CORE_SERVICE || "http://localhost:8082";

const constants = {
  CORE_SERVICE_URL,
  HTTP,
  nonProd,
  ENV: env,
  DATABASE: database,
  DB_HOST,
  DB_TYPE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
} as const;
export default constants;
