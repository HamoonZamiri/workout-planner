import dotenv from "dotenv";
dotenv.config();

export const HTTP = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type APIResponse<T> = {
  message: string;
  data: T;
};

export const CORE_SERVICE_URL =
  process.env.CORE_SERVICE || "http://localhost:8082";
