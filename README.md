# OneKey — Unified AI API Gateway

A full-stack AI API gateway that gives developers a **single endpoint** to access OpenAI, Google Gemini, and Anthropic Claude models — with unified billing, credit-based accounting, and an API key management dashboard.

Inspired by [OpenRouter](https://openrouter.ai), built from scratch as a portfolio project.

---

## ✨ Features

- **Unified LLM endpoint** — one `POST /api/v1/chat/completions` works across OpenAI, Gemini, and Claude
- **Multi-provider routing** — each model can map to multiple backend providers; requests are load-balanced automatically
- **Token-level billing** — credits deducted in real-time based on `inputTokens × cost + outputTokens × cost` per provider
- **API key management** — create, disable, and delete keys; usage tracked per key
- **JWT authentication** — secure httpOnly cookie-based sessions
- **React dashboard** — beautiful dark UI with a model registry, API key manager, and billing page
- **Free signup credits** — new users get $5.00 in credits to start

> **Note:** Currently only Google Gemini models are active. OpenAI and Claude support is stubbed and returns a clear error message.

---

## 🏗️ Architecture

This is a **Turborepo monorepo** with three apps and a shared package:

```
apps/
  api-backend/        # LLM routing server — handles /api/v1/chat/completions
  primary-backend/    # Auth, API keys, payments, model catalog
  dashboard-frontend/ # React SPA — dashboard, auth, billing
packages/
  db/                 # Shared Prisma client + PostgreSQL schema
```

### Request Flow

```
Client → api-backend (Bearer token)
  → validates API key & credits (via db)
  → picks a random provider for the requested model
  → calls OpenAI / Gemini / Claude
  → deducts credits from user balance
  → returns OpenAI-compatible response
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Backend framework | [ElysiaJS](https://elysiajs.com) |
| Database ORM | [Prisma](https://prisma.io) |
| Database | PostgreSQL |
| Frontend | React 19 + Vite |
| Data fetching | React Query |
| Type-safe API client | [Eden Treaty](https://elysiajs.com/eden/treaty/overview) |
| Monorepo | [Turborepo](https://turbo.build) |
| Styling | Tailwind CSS |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- PostgreSQL database

### 1. Clone and install

```sh
git clone https://github.com/your-username/onekey.git
cd onekey
bun install
```

### 2. Configure environment variables

Copy the example env files and fill in your values:

```sh
cp apps/api-backend/.env.example     apps/api-backend/.env
cp apps/primary-backend/.env.example apps/primary-backend/.env
cp packages/db/.env.example          packages/db/.env
```

**`packages/db/.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/onekey"
```

**`apps/primary-backend/.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/onekey"
JWT_SECRET="your-secret-here"
```

**`apps/api-backend/.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/onekey"
GOOGLE_API_KEY="AIza..."          # Required — powers Gemini models
OPENAI_API_KEY="sk-..."           # Optional — OpenAI models currently return a 503
```

### 3. Set up the database

```sh
cd packages/db
bunx prisma migrate dev
```

### 4. Run in development

```sh
# From the repo root — starts all apps
bun run dev
```

| App | Port |
|---|---|
| `api-backend` | 4000 |
| `primary-backend` | 3001 |
| `dashboard-frontend` | 3002 |

---

## 📡 API Usage

Once you have an API key from the dashboard:

```sh
curl -X POST http://localhost:4000/api/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "google/gemini-2.0-flash",
    "messages": [
      { "role": "user", "content": "Hello!" }
    ]
  }'
```

The response format is OpenAI-compatible.

---

## 🗄️ Database Schema

Key models:

- **User** — email, hashed password, credit balance
- **ApiKey** — belongs to a user, soft-deleted, tracks `creditsConsumed`
- **Model** — slug-based model registry (e.g. `openai/gpt-4o`)
- **Provider** — backend providers (OpenAI, Google API, Claude API, Google Vertex)
- **ModelProviderMapping** — maps models to providers with per-token pricing
- **OnrampTransactions** — audit log for credit purchases

---

## 📁 Project Structure

```
apps/api-backend/src/
  index.ts          # Main Elysia server + chat completion route
  types.ts          # Elysia request/response type schemas
  llms/
    Base.ts         # Abstract LLM base class + shared LlmResponse type
    OpenAi.ts       # OpenAI adapter
    Gemini.ts       # Google Gemini adapter
    Claude.ts       # Anthropic Claude adapter

apps/primary-backend/src/
  app.ts            # Root Elysia app — mounts all module routers
  modules/
    auth/           # Sign-up, sign-in, /me, sign-out
    apikeys/        # CRUD for API keys
    models/         # Model + provider catalog endpoints
    payments/       # Credit onramp

apps/dashboard-frontend/src/
  pages/
    Landing.tsx     # Public marketing landing page
    Signin.tsx      # Auth pages
    Signup.tsx
    Dashboard.tsx   # Model registry browser
    Apikeys.tsx     # API key management
    Credits.tsx     # Billing & credit top-up
  components/
    Layout.tsx      # Sidebar layout with auth guard
```

---

## 📄 License

MIT
