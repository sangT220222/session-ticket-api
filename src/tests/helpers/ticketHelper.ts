import request from "supertest";
export type TestAgent = ReturnType<typeof request.agent>;
import {
  buildTicket,
  buildTicketNoPriority,
  buildTicketNoTitle,
  buildTicketNotValidField,
  buildTicketNotValidPriority,
  buildTicketTitleNoChar,
} from "./fakerHelper.js";

// export async function loginUser(
//   agent: TestAgent,
//   email: string,
//   password: string
// ) {
//   return agent.post("/auth/login").send({ email, password });
// }

export async function createTicket(agent: TestAgent) {
  const newTicket = buildTicket();

  const response = await agent.post("/api/create").send(newTicket);

  return { newTicket, response };
}

export async function createWrongTicket1(agent: TestAgent) {
  const newTicket = buildTicketNoPriority();

  const response = await agent.post("/api/create").send(newTicket);

  return { newTicket, response };
}

export async function createWrongTicket2(agent: TestAgent) {
  const newTicket = buildTicketNoTitle();

  const response = await agent.post("/api/create").send(newTicket);

  return { newTicket, response };
}

export async function createWrongTicket3(agent: TestAgent) {
  const newTicket = buildTicketTitleNoChar();

  const response = await agent.post("/api/create").send(newTicket);

  return { newTicket, response };
}

export async function createWrongTicket4(agent: TestAgent) {
  const newTicket = buildTicketNotValidPriority();

  const response = await agent.post("/api/create").send(newTicket);

  return { newTicket, response };
}

export async function createWrongTicket5(agent: TestAgent) {
  const newTicket = buildTicketNotValidField();

  const response = await agent.post("/api/create").send(newTicket);

  return { newTicket, response };
}
