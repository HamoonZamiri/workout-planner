import dotenv from "dotenv";
import { IncomingMessage, Server, ServerResponse } from "http";
import initializeApp from "../../index";
import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { Routine } from "../entities/routine.entity";
import { randomUUID } from "crypto";
dotenv.config();

const HTTP = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

const CORE_SERVICE_URL = process.env.CORE_SERVICE || "http://localhost:8082";

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

  test("Create a routine", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/routine`, {
      method: HTTP.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Routine",
        description: "Test Description",
        timeToComplete: 60,
        userId,
      }),
    });

    expect(res.status).toBe(201);
  });

  test("Get my routines", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/routine/mine/${userId}`,
      {
        method: HTTP.GET,
      },
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.length).toBe(1);
  });
});
