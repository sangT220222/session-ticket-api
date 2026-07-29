import request from "supertest";
import app from "../../app.js";
export type TestAgent = ReturnType<typeof request.agent>;

export async function loginRequestAuth(email: string, password: string) {
  return request(app).post("/auth/login").send({
    email: email,
    password: password,
  });
}
export async function loginRequestTicket(
  agent: TestAgent,
  email: string,
  password: string
) {
  return agent.post("/auth/login").send({ email, password });
}

export async function registerUser(
  agent: TestAgent,
  email: string,
  password: string,
  confirmPassword: string,
  name?: string
) {
  return agent
    .post("/auth/register")
    .send({ email, password, confirmPassword, name });
}
