import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { TEST_USER } from "./fixtures/users.js";
import { loginRequest } from "./helpers/authHelper.js";

//describe = grouping related tests and benchmarks into one place
//register test
describe("Auth API", () => {
  // describe("POST /auth/register", () => {
  //   it("should return 409 due to duplicate email", async () => {
  //     const response = await request(app).post("/auth/register").send({
  //       email: "testRegister2@gmail.com",
  //       password: "1234567891067",
  //       confirmPassword: "1234567891067",
  //       name: "TEST for register user",
  //     });

  //     expect(response.status).toBe(409);
  //     expect(response.body.success).toBe(false);
  //   });

  //   it("should return 400 as password criteria doesn't meet", async () => {
  //     const response = await request(app)
  //       .post("/auth/register")
  //       .send({ email: "testRegister@gmail.com", password: "123456789" });

  //     expect(response.status).toBe(400);
  //   });
  // });

  //login test - admin

  describe("POST /auth/login", () => {
    it("should login success after valid credential Alice", async () => {
      // const response = await request(app).post("/auth/login").send({
      //   email: TEST_USER.admin.email,
      //   password: TEST_USER.admin.password,
      // });
      const response = await loginRequest(
        TEST_USER.admin.email,
        TEST_USER.admin.password
      );
      // console.log("CHECKING RESPONSE");
      // console.log(response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should login success after valid credential BOB", async () => {
      const response = await loginRequest(
        TEST_USER.user1.email,
        TEST_USER.user1.password
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await loginRequest(
        TEST_USER.admin.email,
        "fakePassword123"
      );
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await loginRequest(
        TEST_USER.user1.email,
        "anotherFakePassword"
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  // it("cookie/session validation", async () => {
  //   //checking if session/cookie exists
  //   const agent = request.agent(app);
  //   await agent
  //     .post("/auth/login")
  //     .send({ email: "testing22@gmail.com", password: "1234567891011" });
  //   const response = await agent.get("/auth/checkme");
  //   expect(response.status).toBe(200);
  // });

  //logging out should invalidate session test
  //we utilise supertest's agent that remebers cookies between requests - request.agent(app)
  // describe("POST /auth/logout", () => {
  //   it("logging out should invalidate session", async () => {
  //     const agent = request.agent(app);
  //     await agent
  //       .post("/auth/login")
  //       .send({ email: "testing22@gmail.com", password: "1234567891011" });

  //     await agent.post("/auth/logout");
  //     const afterLogoutResponse = await agent.get("/auth/checkme");

  //     expect(afterLogoutResponse.status).toBe(401);
  //   });
  // });
});
