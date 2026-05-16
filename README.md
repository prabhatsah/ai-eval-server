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
npm run db:start
```

This will start:

- Dev DB → port 5432
- Test DB → port 5433

---

### 4. Setup environment variables

Create `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/ai_eval?schema=public"

JWT_ACCESS_SECRET="YOUR_SECRET"
JWT_REFRESH_SECRET="YOUR_REFRESH_SECRET"

OPENAI_API_KEY=YOUR_API_KEY (optional)
GEMINI_API_KEY=YOUR_API_KEY (optional)
```

Create `.env.test`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/ai_eval_test?schema=public"
JWT_SECRET="testsecret"
JWT_REFRESH_SECRET="YOUR_REFRESH_SECRET"
```

---

### 5. Run migrations

#### Dev DB:

```bash
npm run generate
npm run migrate:dev
```

#### Test DB: (if needed)

```bash
npm run migrate:test
```

---

### 6. Seed data (if needed)

```bash
npx prisma db seed
```

---

### 7. Start server

```bash
npm run start:dev
```

---

### 8. Run tests

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
- Local LLM/OpenAI/GEMINI

---

## Notes

- Always run migrations before starting app
- Use test DB for E2E tests (never dev DB)
- Reset test DB if needed:

```bash
npm run migrate:reset:test
```
