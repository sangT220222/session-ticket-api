import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../app.js";
import { TEST_USER } from "./fixtures/users.js";
import { TEST_TICKETS } from "./fixtures/tickets.js";

// - unauthenticated user blocked
// - normal user only sees own tickets
// - admin sees all tickets
const getQuery = "/api/tickets/" + TEST_TICKETS.ticket1.id;
const updateQueryTicket3 = "/api/update/" + TEST_TICKETS.ticket3.id;
const updateQueryTicket2 = "/api/update/" + TEST_TICKETS.ticket2.id;

it("unathenticated user blocked", async () => {
  const response = await request(app).get("/api/tickets");

  expect(response.status).toBe(401);
});

//Getting ticket queries

describe("Getting normal users' respective tickets", () => {
  it("normal user only seeing their tickets", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - no tickets done
      .send({
        email: TEST_USER.user1.email,
        password: TEST_USER.user1.password,
      });
    const response = await agent.get("/api/tickets");

    expect(response.status).toBe(200);
    // expect(response.body.data.data).toHaveLength(0);
  });

  it("admin seeing all tickets", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //admin login credential - should see all tickets, currently 19 tickets in the db
      .send({
        email: TEST_USER.admin.email,
        password: TEST_USER.admin.password,
      });
    const response = await agent.get("/api/tickets");
    expect(response.status).toBe(200);
    expect(response.body.data.pagination.totalTickets).toBeGreaterThanOrEqual(
      1
    );
  });
});

//test for getting a single ticket
describe("Getting single ticket", () => {
  it("Getting user's single ticket", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: TEST_USER.admin.email,
        password: TEST_USER.admin.password,
      });
    const singleTicket = await agent.get(getQuery);
    // console.log(singleTicket.body.data.length());
    expect(singleTicket.body).toBeDefined();
    expect(singleTicket.body.success).toBe(true);
  });
  it("invalid as ticket doesn't belong to user, and user not admin", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: TEST_USER.user1.email,
        password: TEST_USER.user1.password,
      });
    const noTicket = await agent.get(getQuery);
    expect(noTicket.status).toBe(403);
    expect(noTicket.body.success).toBe(false);
  });
});

//test for creating ticket - faker would be needed
// describe("Creating a ticket", () => {
// //commented the code below as this ahs been tested, the test will fail unless title is changed
// // it("should successfuly create a ticket", async () => {
// //  const agent = request.agent(app);
// //  await agent.post("/auth/login").send({
// //    email: "testing22@gmail.com",
// //    password: "1234567891011",
// //  });
// //  const test2 = await agent.get("/auth/checkme");
// //  console.log(test2.status);
// //  const result = await agent.post("/api/create").send({
//  //   title: "NEW TICKET - change",
// //    description: "initial ticket test",
// //    priority: "high",
// //  });

// //  expect(result.status).toBe(201);
// //  expect(result.body.success).toBe(true);
// // });
//   it("should reject as priority was not provided", async () => {
//     const agent = request.agent(app);
//     await agent.post("/auth/login").send({
//       email: "testing22@gmail.com",
//       password: "1234567891011",
//     });
//     const result = await agent.post("/api/create").send({
//       title: "should reject this",
//       description: "2nd ticket test",
//     });
//     expect(result.status).toBe(400);
//   });

//   it("should reject as title was not provided", async () => {
//     const agent = request.agent(app);
//     await agent.post("/auth/login").send({
//       email: "testing22@gmail.com",
//       password: "1234567891011",
//     });
//     const result = await agent.post("/api/create").send({
//       description: "2nd ticket test",
//       priority: "low",
//     });

//     expect(result.status).toBe(400);
//   });

//   it("should reject as title is only spaces", async () => {
//     const agent = request.agent(app);
//     await agent.post("/auth/login").send({
//       email: "testing22@gmail.com",
//       password: "1234567891011",
//     });
//     const result = await agent.post("/api/create").send({
//       title: "    ",
//       description: "2nd ticket test",
//       priority: "low",
//     });

//     expect(result.status).toBe(400);
//   });

//   it("should reject as title has been used", async () => {
//     const agent = request.agent(app);
//     await agent.post("/auth/login").send({
//       email: "testing22@gmail.com",
//       password: "1234567891011",
//     });
//     const result = await agent.post("/api/create").send({
//       title: "NEW TICKET 10/06",
//       description: "2nd ticket test",
//       priority: "low",
//     });

//     expect(result.status).toBe(409);
//     expect(result.body.success).toBe(false);
//   });

//   it("should reject as priority not in defined enum list", async () => {
//     const agent = request.agent(app);
//     await agent.post("/auth/login").send({
//       email: "testing22@gmail.com",
//       password: "1234567891011",
//     });
//     const result = await agent.post("/api/create").send({
//       title: "should reject this",
//       description: "2nd ticket test",
//       priority: "not valid",
//     });

//     expect(result.status).toBe(400);
//   });

//   it("should reject as field provided isn't valid", async () => {
//     const agent = request.agent(app);
//     await agent.post("/auth/login").send({
//       email: "testing22@gmail.com",
//       password: "1234567891011",
//     });
//     const result = await agent.post("/api/create").send({
//       title: "should reject this",
//       random: "REJECt",
//       description: "2nd ticket test",
//       priority: "not valid",
//     });

//     expect(result.status).toBe(400);
//   });
// });

//update ticket
describe("Updating a ticket - different scenarios", () => {
  // code below has been commented out as this worked, running it again will cause a test fail

  it("Should successfully update a ticket - ticket belongs to user", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: TEST_USER.user1.email,
        password: TEST_USER.user1.password,
      });
    const result = await agent.patch(updateQueryTicket2).send({
      priority: "low",
    });
    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
  });
  it("Should return error - value to update is not in enum", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: TEST_USER.user1.email,
        password: TEST_USER.user1.password,
      });
    const result = await agent.patch(updateQueryTicket2).send({
      priority: "FIVE",
    });
    expect(result.status).toBe(400);
  });
  it("Should return error - field provided is false", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //normal user login credential - 2 tickets done
      .send({
        email: TEST_USER.user1.email,
        password: TEST_USER.user1.password,
      });
    const result = await agent.patch(updateQueryTicket2).send({
      priorities: "urgent",
    });
    expect(result.status).toBe(400);
  });

  //updating someone else's ticket
  it("Should return error - not user's ticket"),
    async () => {
      const agent = request.agent(app);
      await agent.post("/auth/login").send({
        email: TEST_USER.user1.email,
        password: TEST_USER.user1.password,
      });
      const response = await agent.patch(updateQueryTicket3);
      expect(response.status).toBe(403);
    };
  //test for invalid priority status transtion
  it("Should return error - not invalid status transition"),
    async () => {
      const agent = request.agent(app);
      await agent
        .post("/auth/login") //normal user login credential - 2 tickets done
        .send({
          email: TEST_USER.admin.email,
          password: TEST_USER.admin.password,
        });
      const result = await agent.patch(updateQueryTicket2).send({
        priority: "high",
      });
      expect(result.status).toBe(400);
    };

  //ticket not found
  // it("Should return error - ticket does not exist"),
  //   async () => {
  //     const agent = request.agent(app);
  //     await agent
  //       .post("/auth/login") //normal user login credential - 2 tickets done
  //       .send({
  //         email: "twoTickets@gmail.com",
  //         password: "testing2ticketsAccount",
  //       });
  //     const result = await agent
  //       .patch("/api/update/cmq6u7x6c0002esbrmi63tf44")
  //       .send({
  //         priority: "high",
  //       });
  //     expect(result.status).toBe(404);
  //   };

  // code below has been commented out as this worked, running it again will cause a test fail

  // admin can update this ticket
  it("Success - admin can update any tickets", async () => {
    const agent = request.agent(app);
    await agent
      .post("/auth/login") //admin login credential - should see all tickets, currently 19 tickets in the db
      .send({
        email: TEST_USER.admin.email,
        password: TEST_USER.admin.password,
      });
    const response = await agent.patch(updateQueryTicket3).send({
      priority: "low",
    });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
