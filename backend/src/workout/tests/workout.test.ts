import { IncomingMessage, Server, ServerResponse } from "http";
import initializeApp from "../../index";
import { randomUUID } from "crypto";
import { Routine } from "../../routine/entities/routine.entity";
import { FitlogCoreDataSource } from "../../utils/pgres.datasource";
import { Workout } from "../entities/workout.entity";
import { CORE_SERVICE_URL, APIResponse, HTTP } from "../../constants";

describe("Workout module integration tests", () => {
  let server: Server<typeof IncomingMessage, typeof ServerResponse>;
  let userId = randomUUID();
  let routine: Routine;

  beforeAll(async () => {
    server = await initializeApp();
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
    const json = (await res.json()) as APIResponse<Routine>;
    routine = json.data;
  });

  afterAll(async () => {
    await FitlogCoreDataSource.getRepository(Routine).delete({});
    await FitlogCoreDataSource.getRepository(Workout).delete({});
    FitlogCoreDataSource.destroy();
    server.closeAllConnections();
    server.close();
  });

  let workout: Workout;
  test("Create a workout", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/workout`, {
      method: HTTP.POST,
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({
        title: "Test Workout",
        routineId: routine.id,
        load: 100,
      }),
    });
    expect(res.status).toBe(201);
    const json = (await res.json()) as APIResponse<Workout>;
    workout = json.data;
  });

  test("Create a workout with invalid body", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/workout`, {
      method: HTTP.POST,
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({
        title: "Test Workout",
        routineId: routine.id,
        load: 100,
        repsLow: 10,
        repsHigh: 5,
      }),
    });
    expect(res.status).toBe(400);
  });

  test("Get my workouts", async () => {
    const res = await fetch(`${CORE_SERVICE_URL}/api/core/workout/mine/`, {
      headers: {
        "user-id": userId,
      },
      method: HTTP.GET,
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as APIResponse<Workout[]>;
    expect(json.data.length).toBe(1);
  });

  test("Update workout correctly", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/workout/${workout.id}`,
      {
        method: HTTP.PUT,
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          title: "Updated Workout",
          load: 200,
        }),
      },
    );
    expect(res.status).toBe(200);
    const json = (await res.json()) as APIResponse<Workout>;
    workout = json.data;
    expect(workout.title).toBe("Updated Workout");
  });

  test("Update workout with invalid body", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/workout/${workout.id}`,
      {
        method: HTTP.PUT,
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
        },
        body: JSON.stringify({
          title: "Updated Workout",
          load: 200,
          setsLow: 10,
          setsHigh: 5,
        }),
      },
    );
    expect(res.status).toBe(400);
  });

  test("Update workout that does not belong to user", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/workout/${workout.id}`,
      {
        method: HTTP.PUT,
        headers: {
          "user-id": randomUUID(),
        },
        body: JSON.stringify({
          title: "Updated Workout",
        }),
      },
    );

    expect(res.status).toBe(401);
  });

  test("Delete workout successfully", async () => {
    const res = await fetch(
      `${CORE_SERVICE_URL}/api/core/workout/${workout.id}`,
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
