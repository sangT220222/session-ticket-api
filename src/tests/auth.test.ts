import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

//describe = grouping related tests and benchmarks into one place
//register test
describe("Auth API", () => {
  describe("POST /auth/register", () => {
    it("should return 201 if password criteria meets", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "testRegister2@gmail.com",
        password: "1234567891067",
        confirmPassword: "1234567891067",
        name: "TEST for register user",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("should return 400 as password criteria doesn't meet", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ email: "testRegister@gmail.com", password: "123456789" });

      expect(response.status).toBe(400);
    });
  });

  //login test
  describe("POST /auth/login", () => {
    it("should login success after valid credential", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "testing22@gmail.com", password: "1234567891011" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "testing22@gmail.com", password: "1234567891099" });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  //logging out should invalidate session test
  //we utilise supertest's agent that remebers cookies between requests - request.agent(app)
  describe("POST /auth/logout", () => {
    it("logging out should invalidate session", async () => {
      const agent = request.agent(app);
      await agent
        .post("/auth/login")
        .send({ email: "testing22@gmail.com", password: "1234567891011" });

      //checking if session exists
      const response = await agent.get("/auth/checkme");
      expect(response.status).toBe(200);

      await agent.post("/auth/logout");
      const afterLogoutResponse = await agent.get("/auth/checkme");

      expect(afterLogoutResponse.status).toBe(401);
    });
  });
});
