import dotenv from "dotenv";
dotenv.config();

const auth_service_url = process.env.AUTH_SERVICE || "http://localhost:8081";
const core_service_url = process.env.CORE_SERVICE || "http://localhost:8082";
const constants = {
  AUTH_SERVICE: auth_service_url,
  CORE_SERVICE: core_service_url,
} as const;
export default constants;
