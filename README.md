# KapxrPIM Frontend

Production-grade Product Information Management (PIM) frontend built with Vite, React, and TypeScript.

This app follows a frontend-first architecture with a provider abstraction so teams can start with mock data now and switch to a real backend API with minimal UI rewrites.

## Tech Stack

- Vite 5
- React 18 + TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- React Router
- TanStack Query
- Zustand (UI/app state)
- Framer Motion + Recharts
- Vitest + Testing Library

## Quick Start

### Prerequisites

- Node.js 18+ (latest LTS recommended)
- npm 9+

### Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Default local URL is usually [http://localhost:8080](http://localhost:8080) (or the port shown in terminal).

## Environment Variables

See `.env.example`:

- `VITE_PIM_DATA_SOURCE=mock` - use local mock provider and storage
- `VITE_PIM_DATA_SOURCE=api` - use API provider (requires `VITE_API_BASE_URL`)
- `VITE_API_BASE_URL` - backend base URL when using `api` mode

> Never commit `.env` files. Only commit `.env.example`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run build:dev` - development-mode build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint
- `npm run test` - run tests once (Vitest)
- `npm run test:watch` - run tests in watch mode

## Architecture Notes

- Provider interface pattern:
  - `MockPIMProvider` for local mock-first workflows
  - `ApiPIMProvider` for backend integration
  - service/facade layer to keep UI decoupled from data source
- React Query handles caching, invalidation, and app-wide consistency.
- Theme, density, auth session, and common UX helpers are centralized in `src/lib`.

## Project Structure

- `src/components` - reusable components and layout
- `src/pages` - route-level screens
- `src/services` - provider abstraction and data services
- `src/mockdb` - seed/mock datasets
- `src/hooks` - reusable hooks
- `src/lib` - utilities (auth, theme, density, notifications)
- `src/test` - tests and test setup

## Quality Expectations

Before opening PRs:

```bash
npm run lint
npm run test
npm run build
```

## Security & Secrets

- Do not commit secrets, API keys, tokens, or local env files.
- Keep credentials only in local `.env`.
- Rotate compromised keys immediately.

## Branching

- Default branch: `main`
- Use short-lived feature branches and descriptive commit messages.
