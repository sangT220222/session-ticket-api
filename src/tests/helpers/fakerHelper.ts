import { faker } from "@faker-js/faker";
import request from "supertest";
import app from "../../app.js";

//     const result = await agent.post("/api/create").send({
export function buildTicket() {
  return {
    title: faker.lorem.words(3),
    priority: "low",
    description: faker.lorem.sentence(),
  };
}

export function buildTicketNoPriority() {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
  };
}

export function buildTicketNoTitle() {
  return {
    priority: "low",
    description: faker.lorem.sentence(),
  };
}

export function buildTicketTitleNoChar() {
  return {
    title: " ",
    priority: "low",
    description: faker.lorem.sentence(),
  };
}

export function buildTicketNotValidPriority() {
  return {
    title: faker.lorem.words(3),
    priority: "FAKE",
    description: faker.lorem.sentence(),
  };
}

export function buildTicketNotValidField() {
  return {
    title: faker.lorem.words(3),
    random: "RANDOM FIELD",
    priority: "FAKE",
    description: faker.lorem.sentence(),
  };
}
