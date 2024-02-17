import { IncomingMessage, Server, ServerResponse } from "http";
import initializeApp from "./index";
import { AuthDataSource } from "./db/datasource";
import { AuthUser } from "./entities/authUser.entity";
import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:8081";

describe("auth-service-int-tests", () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let userCounter: number = 1;

  beforeAll(async () => {
    server = await initializeApp();
  });

  afterAll(async () => {
    server.closeAllConnections();
    await AuthDataSource.getRepository(AuthUser).clear();
    AuthDataSource.close();
    server.close();
  });

  test("Signup user sucessfully", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test${userCounter}@mail.com`,
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(201);
    userCounter++;
  });

  test("Signup user with existing email", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test1@mail.com`,
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(400);
  });

  test("Signup user with missing field", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emai: `test1@mail.com`,
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(400);
  });

  let accessToken: string;
  let refreshToken: string;
  const LoginResponseSchema = z.object({
    message: z.string(),
    data: z.object({
      accessToken: z.string(),
      id: z.string(),
      email: z.string(),
      refreshToken: z.string(),
    }),
  });

  test("Login user successfully", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test1@mail.com`,
        password: "Password123!",
      }),
    });

    const json = await res.json();
    const parsedResponse = LoginResponseSchema.safeParse(json);
    expect(parsedResponse.success).toBe(true);
    expect(res.status).toBe(200);
    if (parsedResponse.success) {
      accessToken = parsedResponse.data.data.accessToken;
      refreshToken = parsedResponse.data.data.refreshToken;
    }
  });

  let userId: string;
  const authenticateResponseSchema = z.object({
    message: z.string(),
    data: z.object({
      userId: z.string(),
    }),
  });

  test("Authenticate user with JWT token", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    const parsedResponse = authenticateResponseSchema.safeParse(json);
    expect(parsedResponse.success).toBe(true);
    if (parsedResponse.success) {
      userId = parsedResponse.data.data.userId;
    }
  });

  test("Login with invalid password", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test1@mail.com`,
        password: "Password123",
      }),
    });
    expect(res.status).toBe(401);
  });

  test("Refresh token successfully", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/refresh/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });
    expect(res.status).toBe(200);
  });
});
