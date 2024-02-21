import dotenv from "dotenv";
import { IncomingMessage, Server, ServerResponse } from "http";
import initializeApp from "../../index";
import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { Routine } from "../entities/routine.entity";
import { randomUUID } from "crypto";
import { CORE_SERVICE_URL, APIResponse, HTTP } from "../../constants";
dotenv.config();

describe("Routine module integration tests", () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let userId = randomUUID();

  beforeAll(async () => {
    server = await initializeApp();
  });

  afterAll(async () => {
    server.closeAllConnections();
    await FitlogCoreDataSource.getRepository(Routine).delete({});
    FitlogCoreDataSource.destroy();
    server.close();
  });

  let routine: Routine;
  test("Create a routine", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/routine`, {
      method: HTTP.POST,
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({
        title: "Test Routine",
        description: "Test Description",
        timeToComplete: 60,
      }),
    });

    expect(res.status).toBe(201);
    const json = (await res.json()) as APIResponse<Routine>;
    routine = json.data;
  });

  test("Get my routines", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/routine/mine/`, {
      headers: {
        "user-id": userId,
      },
      method: HTTP.GET,
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as APIResponse<Routine[]>;
    expect(json.data.length).toBe(1);
  });

  test("Get all routines", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/routine/`, {
      headers: {
        "user-id": userId,
      },
      method: HTTP.GET,
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as APIResponse<Routine[]>;
    expect(json.data.length).toBe(1);
  });

  test("Update a routine", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/routine/${routine.id}`,
      {
        method: HTTP.PUT,
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          title: "Updated Test Routine",
        }),
      },
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as APIResponse<Routine>;
    expect(json.data.title).toBe("Updated Test Routine");
  });

  test("Update routine which does not belong to me", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/routine/${routine.id}`,
      {
        method: HTTP.PUT,
        headers: {
          "Content-Type": "application/json",
          "user-id": randomUUID(),
        },
        body: JSON.stringify({
          title: "Updated Test Routine",
        }),
      },
    );
    expect(res.status).toBe(401);
  });

  test("Delete routine that does not belong to me", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/routine/${routine.id}`,
      {
        method: HTTP.DELETE,
        headers: {
          "user-id": randomUUID(),
        },
      },
    );
    expect(res.status).toBe(401);
  });

  test("Delete routine", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/routine/${routine.id}`,
      {
        method: HTTP.DELETE,
        headers: {
          "user-id": userId,
        },
      },
    );

    expect(res.status).toBe(200);
  });
});
