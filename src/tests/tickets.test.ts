import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";

// - unauthenticated user blocked
// - normal user only sees own tickets
// - admin sees all tickets

it("unathenticated user blocked", async () => {
  const response = await request(app).get("/api/tickets");

  expect(response.status).toBe(401);
});

describe("Getting normal users' respective tickets", () => {
  it("normal user only seeing their tickets", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - no tickets done
      .send({ email: "testRegister2@gmail.com", password: "1234567891067" });
    const response = await agent.get("/api/tickets");

    expect(response.status).toBe(200);
    expect(response.body.data.data).toHaveLength(0);
  });

  it("normal user only seeing their tickets - this user logged two tickets", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: "twoTickets@gmail.com",
        password: "testing2ticketsAccount",
      });
    const response = await agent.get("/api/tickets");
    const checkMe = await agent.get("/auth/checkMe");
    const userId = checkMe.body.userID;
    expect(response.body.data.data).toHaveLength(2);
    for (const ticket of response.body.data.data) {
      expect(ticket.createdByID).toBe(userId);
    }
  });
});

it("admin seeing all tickets", async () => {
  const agent = request.agent(app);
  await agent
    .post("/auth/login") //admin login credential - should see all tickets, currently 19 tickets in the db
    .send({ email: "testing22@gmail.com", password: "1234567891011" });
  const response = await agent.get("/api/tickets");
  expect(response.status).toBe(200);
  expect(response.body.data.pagination.totalTickets).toBeGreaterThanOrEqual(2);
});
