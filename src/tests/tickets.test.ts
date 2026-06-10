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
    expect(response.body.data.data).toHaveLength(2);
    const checkMe = await agent.get("/auth/checkme");
    const userId = checkMe.body.userID;
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

//test for getting a single ticket
describe("Getting single ticket", () => {
  it("Getting user's single ticket", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: "twoTickets@gmail.com",
        password: "testing2ticketsAccount",
      });
    const singleTicket = await agent.get(
      "/api/tickets/cmq6u7x6c0002esbrmi63tf24"
    );
    // console.log(singleTicket.body.data.length());
    expect(singleTicket.body).toBeDefined();
    expect(singleTicket.body.success).toBe(true);
  });
  it("invalid as ticket doesn't belong to user, and user not admin", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: "twoTickets@gmail.com",
        password: "testing2ticketsAccount",
      });
    const noTicket = await agent.get("/api/tickets/cmnoqdlll0000rzbru6jmgreh");
    expect(noTicket.status).toBe(403);
    // expect(noTicket.body.success).toBe(false);
  });
});

//test for creating ticket
describe("Creating a ticket", () => {
  // commented the code below as this ahs been tested, the test will fail unless title is changed
  // it("should successfuly create a ticket", async () => {
  //   const agent = request.agent(app);
  //   await agent.post("/auth/login").send({
  //     email: "testing22@gmail.com",
  //     password: "1234567891011",
  //   });
  //   const test2 = await agent.get("/auth/checkme");
  //   console.log(test2.status);
  //   const result = await agent.post("/api/create").send({
  //     title: "NEW TICKET - change",
  //     description: "initial ticket test",
  //     priority: "high",
  //   });

  //   expect(result.status).toBe(201);
  //   expect(result.body.success).toBe(true);
  // });

  it("should reject as priority was not provided", async () => {
    const agent = request.agent(app);
    await agent.post("/auth/login").send({
      email: "testing22@gmail.com",
      password: "1234567891011",
    });
    const result = await agent.post("/api/create").send({
      title: "should reject this",
      description: "2nd ticket test",
    });
    expect(result.status).toBe(400);
  });

  it("should reject as title was not provided", async () => {
    const agent = request.agent(app);
    await agent.post("/auth/login").send({
      email: "testing22@gmail.com",
      password: "1234567891011",
    });
    const result = await agent.post("/api/create").send({
      description: "2nd ticket test",
      priority: "low",
    });

    expect(result.status).toBe(400);
  });

  it("should reject as title is only spaces", async () => {
    const agent = request.agent(app);
    await agent.post("/auth/login").send({
      email: "testing22@gmail.com",
      password: "1234567891011",
    });
    const result = await agent.post("/api/create").send({
      title: "    ",
      description: "2nd ticket test",
      priority: "low",
    });

    expect(result.status).toBe(400);
  });

  it("should reject as title has been used", async () => {
    const agent = request.agent(app);
    await agent.post("/auth/login").send({
      email: "testing22@gmail.com",
      password: "1234567891011",
    });
    const result = await agent.post("/api/create").send({
      title: "NEW TICKET 10/06",
      description: "2nd ticket test",
      priority: "low",
    });

    expect(result.status).toBe(409);
    expect(result.body.success).toBe(false);
  });

  it("should reject as priority not in defined enum list", async () => {
    const agent = request.agent(app);
    await agent.post("/auth/login").send({
      email: "testing22@gmail.com",
      password: "1234567891011",
    });
    const result = await agent.post("/api/create").send({
      title: "should reject this",
      description: "2nd ticket test",
      priority: "not valid",
    });

    expect(result.status).toBe(400);
  });

  it("should reject as field provided isn't valid", async () => {
    const agent = request.agent(app);
    await agent.post("/auth/login").send({
      email: "testing22@gmail.com",
      password: "1234567891011",
    });
    const result = await agent.post("/api/create").send({
      title: "should reject this",
      random: "REJECt",
      description: "2nd ticket test",
      priority: "not valid",
    });

    expect(result.status).toBe(400);
  });
});

//update ticket
