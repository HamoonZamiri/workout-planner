import { IncomingMessage, Server, ServerResponse } from "http";
import initializeApp from "./index";
import { AuthDataSource } from "./db/datasource";
let server: Server<typeof IncomingMessage, typeof ServerResponse>;
describe("auth-service-int-tests", () => {
  beforeAll(async () => {
    server = await initializeApp();
  });

  afterAll(() => {
    server.closeAllConnections();
    AuthDataSource.close();
    server.close();
  });

  test("signup user sucessful", async () => {
    const randomNum = Math.floor(Math.random() * 1000);
    const res = await fetch("http://localhost:8081/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: `test${randomNum}@mail.com`,
        password: "Password123!",
      }),
    });

    expect(res.status).toBe(201);
  });
});
