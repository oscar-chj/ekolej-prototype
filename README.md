# Student Merit Management System (SMMS)

A modern web application for tracking and managing university student merit points, events, and activity records. Built with Next.js, TypeScript, Prisma and a component library for a responsive and accessible UI.

## Features

- Student dashboard with merit point summaries and progress insights
- Event creation and registration workflows
- Points breakdown by category (Academic, Co-curricular, Community)
- Admin utilities for importing merit records and managing events
- Authentication and session management (development-focused)
- Prisma ORM for a typed database layer and migrations

## Tech stack

- Next.js (App Router)
- TypeScript
- Prisma (Postgres / SQLite compatible)
- React + MUI (or similar UI primitives) for components
- Docker / Docker Compose for local services

## Quick start (development)

Prerequisites:

- Node.js (16+ recommended)
- yarn (or npm) installed
- Docker & Docker Compose (for local DB, optional)

Install dependencies:

```bash
yarn
```

Start local infrastructure with Docker Compose (optional but recommended when using Postgres):

```bash
docker compose up -d
```

Generate Prisma client and run migrations:

```bash
yarn db:generate && yarn db:migrate:dev
```

Start the Next.js development server:

```bash
yarn dev
```

Open Prisma Studio (database GUI):

```bash
yarn db:studio
```

Notes:

- If you prefer not to use Docker, ensure your DATABASE_URL environment variable points to a running database instance (see Environment section).

## Environment variables

Create a `.env` file (or set variables in your environment). Common variables used in this project include:

- DATABASE_URL - the connection string for Prisma (Postgres recommended in production)
- NEXTAUTH_URL - the base URL for NextAuth or any auth redirects (e.g. http://localhost:3000)
- NEXT_PUBLIC_SOME_KEY - any client-exposed config values

Example `.env` (development):

```
DATABASE_URL="postgresql://user:password@localhost:5432/smms?schema=public"
NEXTAUTH_URL=http://localhost:3000
```

Adjust names and values to match your environment and secrets manager.

## Database (Prisma)

- Schema is defined in `prisma/schema.prisma` and a generated client lives in `generated/prisma`.
- To regenerate Prisma client after schema changes:

```bash
yarn db:generate
```

- To create and apply migrations (development):

```bash
yarn db:migrate:dev
```

- To open Prisma Studio:

```bash
yarn db:studio
```

Seeding:

- The repository includes a `prisma/seed.ts` script. If you have migrations already applied, run the seed as configured (check package.json scripts).

## Running in Docker (production-like)

- Build and run services via Docker Compose. The project includes `docker-compose.yml` that can be used to spin up the app and DB together.

Example:

```bash
docker compose up --build -d
```

Follow your container logs or exec into the container for debugging.

## Linting, Typechecking and Tests

- Typecheck and lint (if configured) before committing changes:

```bash
yarn typecheck
yarn lint
```

- If tests are present, run them with:

```bash
yarn test
```

If these scripts are not defined in `package.json`, inspect the file and adapt commands or add scripts for CI integration.

## Deployment

- For production, build the Next.js app and deploy to your preferred host (Vercel, Docker host, Kubernetes, etc.).

```bash
yarn build
yarn start
```

- Ensure `DATABASE_URL` and any auth related environment variables are set in the target environment.

## Architecture & Project Structure

The application follows a **Layered Service-Oriented Architecture** to ensure clean separation of concerns and high performance.

### Layers

1.  **Service Layer (`src/lib/services/`)**
    *   The core business logic of the application.
    *   Directly interacts with **Prisma** to perform database operations.
    *   Centralizes validation and data transformation logic.
    *   *Examples: `meritService.ts`, `eventService.ts`, `leaderboardService.ts`*

2.  **Server Actions (`src/app/actions/`)**
    *   Thin wrappers around the Service Layer used for mutations.
    *   Handle authentication checks and Next.js cache revalidation (`revalidatePath`).
    *   Called directly from React Client Components.

3.  **API Routes (`src/app/api/`)**
    *   Thin wrappers around the Service Layer that expose functionality via REST endpoints.
    *   Enables external client access and standard HTTP interactions.

4.  **Client Services (`src/services/`)**
    *   An abstraction layer for Client Components to interact with API Routes.
    *   Implements **Request Deduplication**: Prevents redundant concurrent API calls by caching in-flight promises.
    *   Implements **In-Memory Caching**: Shared data fetching across independent components.

5.  **Modular UI Components (`src/components/`)**
    *   UI is broken down into small, single-responsibility components.
    *   Complex logic is extracted into custom hooks (e.g., `src/components/events/useEvents.ts`).

### Directory Overview

- `src/app/` - Next.js pages and API routes.
- `src/app/actions/` - Server Actions for client-side mutations.
- `src/components/` - Modular UI components organized by feature.
- `src/lib/services/` - Server-side service layer (Database logic).
- `src/services/` - Client-side service layer (API abstraction + deduplication).
- `src/hooks/` - Global shared React hooks.
- `prisma/` - Database schema and migrations.

## Troubleshooting

- "Cannot connect to database": verify `DATABASE_URL`, database service is running, and credentials are correct.
- "Prisma client not found": run `yarn db:generate`.
- Request Deduplication issues: The client services clear their cache every 100ms; ensure components aren't assuming long-term persistence in the service layer.

---
For more details, explore the code under `src/` and `app/`.
