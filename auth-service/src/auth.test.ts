import { IncomingMessage, Server, ServerResponse } from "http";
import initializeApp from "./index";
import { AuthDataSource } from "./db/datasource";
import { AuthUser } from "./entities/authUser.entity";
import z from "zod";
import dotenv from "dotenv";
dotenv.config();

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:8081";

type APIResponse<T> = {
  message: string;
  data: T;
};

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

  type LoginResponse = {
    accessToken: string;
    id: string;
    email: string;
    refreshToken: string;
  };

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

    expect(res.status).toBe(200);

    const json = (await res.json()) as APIResponse<LoginResponse>;
    accessToken = json.data.accessToken;
    refreshToken = json.data.refreshToken;
    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
  });

  let userId: string;
  type AuthenticateResponse = {
    userId: string;
  };

  test("Authenticate user with JWT token", async () => {
    const res = await fetch(`${AUTH_SERVICE_URL}/api/auth/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as APIResponse<AuthenticateResponse>;
    expect(json.data.userId).toBeTruthy();
    userId = json.data.userId;
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
