# AI Evaluation Backend

## Setup Guide

### 1. Clone the repo

```bash
git clone <repo-url>
cd ai-eval-serve
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start PostgreSQL using Docker

```bash
docker-compose up -d
```

This will start:

- Dev DB → port 5432
- Test DB → port 5433

---

### 4. Setup environment variables

Create `.env`:

```env
DATABASE_URL="YOUR_DB_URL"

JWT_ACCESS_SECRET="YOUR_SECRET"
JWT_REFRESH_SECRET="YOUR_REFRESH_SECRET"

OPENAI_API_KEY=YOUR_API_KEY
```

Create `.env.test`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/ai_eval_test?schema=public"
JWT_SECRET="testsecret"
```

---

### 5. Run migrations

#### Dev DB:

```bash
npm run generate:dev
npm run migrate:dev
```

#### Test DB:

```bash
npm run migrate:test
```

---

### 6. Start server

```bash
npm run start:dev
```

---

### 7. Run tests

#### Unit tests:

```bash
npm run test
```

#### E2E tests:

```bash
npm run test:e2e
```

---

## Testing Strategy

- Unit tests → inside `src/`
- E2E tests → inside `test/`

---

## Tech Stack

- NestJS
- PostgreSQL (Docker)
- Prisma ORM
- JWT Auth
- Jest (Unit + E2E)

---

## Notes

- Always run migrations before starting app
- Use test DB for E2E tests (never dev DB)
- Reset test DB if needed:

```bash
npm run migrate:reset:test
```
