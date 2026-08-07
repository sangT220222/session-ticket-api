# Ticket API

A production-style RESTful API built from scratch with **TypeScript**, **PostgreSQL**, and **Express**, implementing core security practices such as session-based authentication, rate limiting, and request validation.

## Table of Contents

- [Purpose](#purpose)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [API Example](#api-example)
- [Security](#security)
- [Future Improvements](#future-improvements)

## Purpose

This project demonstrates how to build a production-style RESTful API from scratch, covering realistic architecture, authentication, and baseline security measures such as sessions, rate limiting, and time-delayed responses.

## Technology Stack

| Category      | Tools                              |
| ------------- | ---------------------------------- |
| Language      | TypeScript                         |
| Framework     | Express.js                         |
| Database      | PostgreSQL, Prisma ORM             |
| Session Store | Redis                              |
| Testing       | Vitest, Supertest                  |
| Validation    | Zod                                |
| Security      | Helmet, bcrypt, express-rate-limit |
| Documentation | OpenAPI 3.1.0, Swagger UI          |
| CI/CD         | GitHub Actions                     |

## Architecture

```
Client Request
      ↓
Express Route
      ↓
Middleware (Authentication, Authorisation, Validation)
      ↓
Controller
      ↓
Service (Business Logic)
      ↓
Prisma ORM
      ↓
PostgreSQL
```

## Features

- Session-based authentication
- Role-based authorisation
- Ticket ownership checks
- Pagination, filtering, and sorting
- OpenAPI documentation
- Integration tests
- CI workflow
- Request validation
- Password hashing
- Rate limiting

## Installation

```bash
# Install dependencies
npm install

# Start supporting services (PostgreSQL, Redis, etc.)
docker compose up -d

# Run database migrations
npx prisma migrate dev

# Seed the database
npm run seed

# Start the development server
npm run dev
```

## Running Tests

```bash
npm run test
npm run test:watch
```

## Project Structure

```
src/
├── authentication/
├── controllers/
├── lib/
├── middleware/
├── routes/
├── services/
├── schemas/
├── tests/
└── types/
```

## Authentication

Authentication is session-based, using Express Session backed by Redis. A successful login creates an HTTP-only session cookie, which is required to access protected API endpoints.

## API Example

**Request**

```http
POST /api/create
Content-Type: application/json
```

```json
{
  "title": "Example 1",
  "description": "This is for README.md",
  "priority": "high"
}
```

## Security

- Password hashing with bcrypt
- HTTP security headers via Helmet
- Login rate limiting
- HTTP-only session cookies
- Request validation with Zod
- Role-based access control

## Future Improvements

- Docker containerisation
- Refresh tokens / JWT alternative
- Monitoring & logging
- Caching
