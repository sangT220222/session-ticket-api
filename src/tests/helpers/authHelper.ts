import request from "supertest";
import app from "../../app.js";

export async function loginRequest(email: string, password: string) {
  return request(app).post("/auth/login").send({
    email: email,
    password: password,
  });
}
