import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../app.js";
import { TEST_USER } from "./fixtures/users.js";
import { loginRequestAuth, registerUser } from "./helpers/authHelper.js";
import { REGISTER_USER } from "./factories/user_factory.js";

//describe = grouping related tests and benchmarks into one place
//register test
const agent = request.agent(app);

describe("Auth API", () => {
  describe("POST /auth/login", () => {
    it("should login success after valid credential Alice", async () => {
      const response = await loginRequestAuth(
        TEST_USER.admin.email,
        TEST_USER.admin.password
      );
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should login success after valid credential BOB", async () => {
      const response = await loginRequestAuth(
        TEST_USER.user1.email,
        TEST_USER.user1.password
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await loginRequestAuth(
        TEST_USER.admin.email,
        "fakePassword123"
      );
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await loginRequestAuth(
        TEST_USER.user1.email,
        "anotherFakePassword"
      );

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

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
  describe("Registering a user", () => {
    it("Registering a new user", async () => {
      const response = await registerUser(
        agent,
        REGISTER_USER.email,
        REGISTER_USER.password,
        REGISTER_USER.confirmPassword,
        REGISTER_USER.name
      );
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
    it("Error due to incorrect confirm password", async () => {
      const response = await registerUser(
        agent,
        REGISTER_USER.email,
        REGISTER_USER.password,
        "thisWillBeWrongAndCauseError",
        REGISTER_USER.name
      );
      expect(response.status).toBe(400);
    });
    it("Error due to existing user", async () => {
      const response = await registerUser(
        agent,
        REGISTER_USER.email,
        "newPassword1234shouldFail",
        "newPassword1234shouldFail"
      );
      expect(response.status).toBe(409);
    });
  });
});
