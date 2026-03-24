# KAPXR PIM - System Understanding, Backend Planning, and API Specification

## 1) Objective

Create a production-ready backend plan for `kapxrpim-main` so the frontend can move cleanly from mock/localStorage data to real APIs with minimal UI rewrites.

This document focuses on:
- Current app understanding (what exists today)
- Gaps between current mock architecture and production needs
- Recommended Node.js + TypeScript backend architecture
- Database and infrastructure choices
- Complete API requirements for current frontend modules
- Phased migration plan from mock provider to API provider

No implementation code is included.

---

## 2) Current App Understanding

## 2.1 Frontend architecture (already prepared for migration)

The app already has a strong provider abstraction:
- `PIMProvider` interface for core PIM entities and operations
- `BillingProvider` interface for subscription and checkout flows
- `mock*Provider` implementations using localStorage/mock seeds
- `api*Provider` implementations partially wired to HTTP endpoints
- React Query hooks and invalidation strategy centralized in hooks/services

This means backend migration can happen by completing API contracts and enabling `api` data source, not by rewriting all pages.

## 2.2 App modules visible in routes/pages

Core modules:
- Dashboard
- Products
- Brands
- Categories
- Attributes
- Assets
- Integrations
- Import/Export
- Analytics
- Team
- Billing
- Settings
- Help
- Activity
- Workflows

Auth flow exists in UI (`signin/signup/signout`) but is currently localStorage-based and not server-verified.

## 2.3 Mock-data and API-readiness status

Well-aligned with API:
- Products, categories, assets, attributes, integrations, import-export history, analytics metrics, team, billing

Known backend-readiness gaps:
- `apiPimProvider` brand APIs are not implemented yet in frontend provider
- Some modules are still page-hardcoded (help/activity/workflow/demo sections, parts of billing usage/invoice display)
- Current model fields are UI-shaped (string dates, denormalized names), not fully normalized for production

---

## 3) System Requirements

## 3.1 Functional requirements

- Catalog management: products, brands, categories, attributes
- Digital asset management: upload/list/update/delete assets
- Team/user management (workspace members and roles)
- Integrations management (connect/disconnect/status/config)
- Import/export jobs and history
- Analytics metrics for dashboard
- Billing/subscription lifecycle + payment checkout
- Authentication and authorization
- Audit/activity logs

## 3.2 Non-functional requirements

- Multi-tenant by workspace/organization
- Horizontal scalability
- API latency target: p95 < 300ms for standard list/detail operations
- High reliability for billing/import/export/integration workflows
- Secure by default (JWT/session hardening, RBAC, secrets management)
- Observability (structured logs, traces, metrics, audit trails)

---

## 4) Recommended Backend Stack (Node.js + TypeScript)

## 4.1 Framework

Primary recommendation: **NestJS (TypeScript)**
- Better module boundaries for growing SaaS backend
- Built-in DI, guards, pipes, interceptors, validation
- Cleaner domain/service layering than ad-hoc Express as complexity increases

Alternative: Express + TypeScript if team strongly prefers lightweight setup, but NestJS is better for long-term maintainability.

## 4.2 Database

Primary DB: **PostgreSQL**
- Strong relational consistency for catalog, billing, team, workspace, and audit data
- Excellent indexing, JSONB support, and transactional integrity
- Suitable for PIM entity relationships and reporting

Optional secondary:
- OpenSearch/Meilisearch later for advanced search and faceting if needed

## 4.3 Infra components

- **Redis**: caching, rate limiting counters, short-lived sessions/tokens, idempotency keys
- **Queue**: BullMQ (Redis-backed) for import/export, image processing, integration sync jobs, webhooks
- **Object storage**: S3-compatible storage for assets
- **CDN**: signed URLs / cached delivery for media
- **Payment provider**: Stripe recommended as primary; keep provider abstraction to support PayPal/Razorpay
- **Auth**: JWT access + refresh token rotation (or secure session strategy)

## 4.4 ORM and contracts

- ORM: Prisma (good developer velocity + type safety) or Drizzle (lean SQL-first)
- API contracts: OpenAPI/Swagger as source of truth
- Validation: Zod or class-validator DTOs with strict schemas

---

## 5) Proposed Service Architecture

Suggested bounded modules/services:

1. **Identity Service**
   - Auth (signup/signin/signout/refresh)
   - User profile, password reset, email verification
   - Role/permission checks

2. **Workspace & Team Service**
   - Workspace metadata
   - Team member CRUD and invitations
   - Role management (Admin/Editor/Viewer)

3. **Catalog Service**
   - Products, brands, categories, attributes
   - Validation and relational integrity

4. **Asset Service**
   - Asset metadata CRUD
   - Upload sessions, signed URLs
   - Optional async processing hooks

5. **Integration Service**
   - Integration connection state and configs
   - Connector credentials and sync status

6. **Import/Export Service**
   - Job creation and processing
   - History and status tracking

7. **Analytics Service**
   - Dashboard metrics aggregation
   - Cached/statistical views

8. **Billing Service**
   - Plans, subscription, checkout sessions
   - Webhook processing, invoices/usage

9. **Activity/Audit Service**
   - Immutable event log for user/system actions

All services must enforce workspace tenancy and RBAC.

---

## 6) Data Model Direction (Production Shape)

## 6.1 Core entities

- `workspaces`
- `users`
- `workspace_members`
- `products`
- `brands`
- `categories`
- `attributes`
- `product_attributes` (EAV or JSON strategy, depending on flexibility need)
- `assets`
- `product_assets`
- `integrations`
- `import_export_jobs`
- `analytics_snapshots` (or materialized/reporting tables)
- `subscriptions`
- `plans`
- `invoices`
- `audit_logs`

## 6.2 Key model improvements from current frontend shape

- Replace string relation fields with IDs:
  - product.categoryName -> `categoryId`
  - attribute.categories[] -> relation table
- Normalize date/time to ISO timestamps
- Add tenant columns (`workspaceId`) to all business tables
- Add optimistic concurrency fields (`version`, `updatedAt`)
- Keep UI convenience fields as derived response properties where needed

---

## 7) API Design Principles

- Base path: `/api/v1`
- Tenant scope from auth context (preferred) or explicit workspace routing
- Standard list pattern:
  - `page`, `limit`, `sort`, `order`, `search`, filter query params
- Standard response envelope:
  - `data`, `meta`, `error`
- Error shape:
  - `code`, `message`, `details`, `traceId`
- Idempotency for write-heavy or payment-sensitive endpoints
- Soft delete where product/business recovery is needed

---

## 8) Required API Endpoints (v1)

Below is a complete API scope to support the current app and remove mock dependencies.

## 8.1 Auth and account

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/signout`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## 8.2 Workspace and team

- `GET /team/members`
- `POST /team/members`
- `PATCH /team/members/:id`
- `DELETE /team/members/:id`
- `POST /team/invitations`
- `GET /team/invitations`
- `DELETE /team/invitations/:id`

## 8.3 Products

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`
- `POST /products/:id/publish`
- `POST /products/:id/unpublish`

Recommended list filters:
- `search`, `status`, `categoryId`, `brandId`, `completenessMin`, `completenessMax`

## 8.4 Brands

- `GET /brands`
- `GET /brands/:id`
- `POST /brands`
- `PATCH /brands/:id`
- `DELETE /brands/:id`

## 8.5 Categories

- `GET /categories`
- `GET /categories/:id`
- `POST /categories`
- `PATCH /categories/:id`
- `DELETE /categories/:id`

Optional:
- `GET /categories/tree`

## 8.6 Attributes

- `GET /attributes`
- `GET /attributes/:id`
- `POST /attributes`
- `PATCH /attributes/:id`
- `DELETE /attributes/:id`

## 8.7 Assets

- `GET /assets`
- `GET /assets/:id`
- `POST /assets/upload-url`
- `POST /assets` (create metadata after upload)
- `PATCH /assets/:id`
- `DELETE /assets/:id`

Optional:
- `POST /assets/:id/attach` (to product)
- `POST /assets/:id/detach`

## 8.8 Integrations

- `GET /integrations`
- `PATCH /integrations/:id`
- `POST /integrations/:id/connect`
- `POST /integrations/:id/disconnect`
- `POST /integrations/:id/sync`
- `GET /integrations/:id/logs`

## 8.9 Import/Export

- `GET /import-export/history`
- `POST /import-export/history` (manual record, if still needed)
- `POST /imports` (create import job)
- `GET /imports/:jobId`
- `GET /exports`
- `POST /exports`
- `GET /exports/:jobId`

## 8.10 Analytics

- `GET /analytics/metrics`
- `GET /analytics/summary`
- `GET /analytics/trends`

## 8.11 Billing

- `GET /billing/plans`
- `GET /billing/subscription`
- `POST /billing/checkout/session`
- `POST /billing/subscription/change-plan`
- `POST /billing/subscription/cancel`
- `POST /billing/subscription/resume`
- `GET /billing/invoices`
- `GET /billing/usage`
- `POST /billing/webhooks/:provider` (internal/provider callback)

## 8.12 Activity and audit

- `GET /activity/logs`
- `GET /audit/logs`

## 8.13 Settings/help/workflow (optional but recommended for full backend parity)

- `GET /settings`
- `PATCH /settings`
- `GET /help/faqs`
- `GET /help/tutorials`
- `GET /workflows/templates`

---

## 9) Request/Response Contract Notes (Critical)

- IDs should be stable opaque values (UUID preferred) even if frontend currently uses numeric IDs.
- Return both canonical and display fields where migration requires it.
- Always include:
  - `createdAt`, `updatedAt`
  - `createdBy` where useful
  - `workspaceId` internally (not always exposed)
- Add pagination metadata on list endpoints:
  - `meta: { page, limit, total, totalPages }`
- For writes, return current canonical entity snapshot (not partial ack only).

---

## 10) Security and Access Control

- RBAC at route/service layer:
  - Admin: full access
  - Editor: catalog/content mutation
  - Viewer: read-only
- Secrets never stored in frontend localStorage (integration credentials, tokens)
- Rate limiting for auth and public-facing endpoints
- Audit log all critical actions:
  - auth events
  - billing changes
  - integration connect/disconnect
  - destructive catalog operations

---

## 11) Performance and Scalability Strategy

- Cache frequently-read resources:
  - plans, category tree, dashboard metrics
- Queue heavy workloads:
  - imports/exports, webhook retries, integration sync
- DB indexing:
  - product filters, sku uniqueness, workspace scoped indexes
- Add cursor-based pagination for very large product lists later
- Design all app servers stateless for horizontal scaling

---

## 12) Migration Plan: Mock -> API (No UI Rewrite Strategy)

## Phase 0 - Contract freeze

- Finalize API schemas to match/extend current provider contracts
- Decide ID strategy and relation mapping
- Publish OpenAPI draft

## Phase 1 - Core catalog parity

- Implement products/categories/attributes/assets APIs
- Complete brand APIs (currently missing in `apiPimProvider`)
- Add mapper updates for normalized fields
- Enable `VITE_PIM_DATA_SOURCE=api` in non-prod

## Phase 2 - Team, integrations, import/export

- Implement team member endpoints and invitation flow
- Implement integration connect/disconnect/sync contracts
- Shift import/export from local records to job-based backend

## Phase 3 - Analytics and activity

- Replace hardcoded dashboard/activity datasets with backend queries
- Add caching layer for dashboard metrics

## Phase 4 - Billing hardening

- Finalize provider-agnostic billing abstraction
- Implement invoices, usage, webhook reliability and idempotency

## Phase 5 - Auth migration

- Replace localStorage auth guard with `/auth/me` + token/session validation
- Introduce refresh token/session rotation and secure logout

---

## 13) Risks and Mitigations

1. **Frontend model mismatch (string names vs relational IDs)**
   - Mitigation: temporary dual-field responses + mapper layer

2. **Incomplete API provider implementations**
   - Mitigation: prioritize parity for all provider methods before switching defaults

3. **Hidden assumptions from localStorage single-user model**
   - Mitigation: enforce workspace isolation, optimistic concurrency, and server validation

4. **Billing/provider coupling**
   - Mitigation: internal billing abstraction and webhook normalization

5. **Analytics cost at scale**
   - Mitigation: pre-aggregations/materialized views + Redis cache

---

## 14) Recommended Build Order (Backend Team)

1. Foundation: auth, workspace, RBAC, shared error/response patterns
2. Catalog: products, categories, brands, attributes
3. Assets: storage + metadata
4. Team + integrations
5. Import/export job system
6. Analytics and activity
7. Billing and webhooks
8. Production hardening (observability, SLOs, load testing)

---

## 15) Final Recommendation

Use **NestJS + PostgreSQL + Redis + BullMQ + S3-compatible storage**, with OpenAPI-first contracts and strict workspace-based RBAC.

This is the most stable path to:
- Move from mock data to real API with low frontend churn
- Support future scale and enterprise features
- Maintain developer velocity with strong TypeScript boundaries

---

## 16) Capacity Estimation (Initial)

These numbers are planning assumptions for v1 and should be validated with real traffic after launch.

### 16.1 Assumptions

- Workspaces: 2,000 in first year
- Active users: 50,000 MAU, 8,000 DAU
- Avg requests per DAU per day: 120
- Read/Write ratio: 85/15
- Peak factor over average: 3x
- Avg API payload: 8 KB (JSON)

### 16.2 Traffic estimate

- Daily requests: `8,000 * 120 = 960,000`
- Average RPS: `960,000 / 86,400 ~= 11.1`
- Peak RPS: `11.1 * 3 ~= 33.3`
- Planned safe target (including bursts, jobs, webhooks): **100-150 RPS**

### 16.3 Data estimate

- Products per workspace (avg): 5,000
- Total products: `2,000 * 5,000 = 10,000,000`
- Product row + indexes + metadata effective footprint: ~2 KB average
- Product storage: ~20 GB core data
- Assets metadata + job history + logs + audit: 30-60 GB/year (excluding binary files)
- Binary assets live in object storage, not PostgreSQL

### 16.4 Cache and queue sizing (initial)

- Redis memory target: 2-4 GB (query cache, rate limits, job state)
- Queue throughput: target 20-50 jobs/sec for import/sync workloads
- Worker autoscaling by queue lag + job age

---

## 17) High-Level Architecture (v1)

```text
[Web Frontend (React)]
        |
        v
[CDN + WAF + TLS]
        |
        v
[API Gateway / LB]
        |
        v
[NestJS API Pods]
   |        |         |
   |        |         +--> [BullMQ Workers]
   |        |                   |
   |        |                   +--> [External Integrations]
   |        |
   |        +--> [Redis] (cache, rate-limit, queue backend)
   |
   +--> [PostgreSQL] (primary relational store)
   |
   +--> [Object Storage + CDN] (assets)
   |
   +--> [Payment Provider Webhooks]
```

### 17.1 Why this architecture

- Keeps app servers stateless and horizontally scalable
- Separates API request path from heavy async processing
- Uses PostgreSQL for relational consistency, Redis for speed
- Supports phased growth from modular monolith to microservices later

---

## 18) Database Schema (Proposed v1 SQL)

Use PostgreSQL with UUID primary keys and workspace scoping.

```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID NOT NULL REFERENCES users(id),
  role TEXT NOT NULL CHECK (role IN ('admin','editor','viewer')),
  status TEXT NOT NULL CHECK (status IN ('active','invited')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

CREATE TABLE brands (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  logo_asset_id UUID,
  contact_email TEXT,
  contact_phone TEXT,
  country TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INT NOT NULL DEFAULT 1
);

CREATE TABLE categories (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  parent_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, slug)
);

CREATE TABLE products (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','in_review','published')),
  completeness SMALLINT NOT NULL DEFAULT 0 CHECK (completeness BETWEEN 0 AND 100),
  channels_count INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  version INT NOT NULL DEFAULT 1,
  UNIQUE (workspace_id, sku)
);

CREATE TABLE attributes (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text','rich_text','number','select','multi_select')),
  attribute_group TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  options JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_attribute_values (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  product_id UUID NOT NULL REFERENCES products(id),
  attribute_id UUID NOT NULL REFERENCES attributes(id),
  value_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, attribute_id)
);

CREATE TABLE assets (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INT,
  height INT,
  storage_key TEXT NOT NULL,
  cdn_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_assets (
  product_id UUID NOT NULL REFERENCES products(id),
  asset_id UUID NOT NULL REFERENCES assets(id),
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, asset_id)
);

CREATE TABLE integrations (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  provider TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('connected','not_connected','error')),
  config_json JSONB,
  secrets_ref TEXT,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, provider)
);

CREATE TABLE import_export_jobs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  job_type TEXT NOT NULL CHECK (job_type IN ('import','export')),
  entity_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued','running','completed','failed')),
  records_count INT NOT NULL DEFAULT 0,
  error_message TEXT,
  requested_by UUID REFERENCES users(id),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE plans (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_cents INT NOT NULL,
  currency TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly','yearly')),
  features_json JSONB NOT NULL
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  plan_id UUID NOT NULL REFERENCES plans(id),
  provider TEXT NOT NULL,
  provider_subscription_id TEXT,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id)
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  subscription_id UUID REFERENCES subscriptions(id),
  provider_invoice_id TEXT,
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  invoice_url TEXT,
  issued_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB,
  trace_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 19) API Contract Examples (Request/Response)

All endpoints are under `/api/v1`.

### 19.1 Standard envelopes

Success:

```json
{
  "data": {},
  "meta": {
    "traceId": "trc_01HQ..."
  }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      { "field": "sku", "message": "SKU already exists" }
    ],
    "traceId": "trc_01HQ..."
  }
}
```

### 19.2 `GET /products`

Query params:
- `page`, `limit`, `search`, `status`, `categoryId`, `brandId`, `sort`, `order`

Response:

```json
{
  "data": [
    {
      "id": "5b34d7c5-2ad6-4d8f-a487-9b4e1fa2b95f",
      "name": "Air Max 270",
      "sku": "NK-AM270-001",
      "status": "published",
      "completeness": 96,
      "channelsCount": 4,
      "category": { "id": "8e3...", "name": "Footwear" },
      "brand": { "id": "9f1...", "name": "Nike" },
      "imageUrl": "https://cdn.example.com/assets/abc.jpg",
      "createdAt": "2026-03-20T10:21:00.000Z",
      "updatedAt": "2026-03-21T08:03:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 4210,
    "totalPages": 211,
    "traceId": "trc_01HQ..."
  }
}
```

### 19.3 `POST /products`

Request:

```json
{
  "name": "Air Max 270",
  "sku": "NK-AM270-001",
  "categoryId": "8e3...",
  "brandId": "9f1...",
  "status": "draft"
}
```

Response:

```json
{
  "data": {
    "id": "5b34d7c5-2ad6-4d8f-a487-9b4e1fa2b95f",
    "name": "Air Max 270",
    "sku": "NK-AM270-001",
    "status": "draft",
    "completeness": 10,
    "channelsCount": 0,
    "createdAt": "2026-03-21T10:00:00.000Z",
    "updatedAt": "2026-03-21T10:00:00.000Z",
    "version": 1
  },
  "meta": { "traceId": "trc_01HQ..." }
}
```

### 19.4 `PATCH /brands/:id`

Request:

```json
{
  "name": "Nike Global",
  "website": "https://www.nike.com",
  "status": "active",
  "contactEmail": "partnerships@nike.com",
  "country": "US",
  "version": 3
}
```

Response:

```json
{
  "data": {
    "id": "9f1...",
    "name": "Nike Global",
    "status": "active",
    "website": "https://www.nike.com",
    "contactEmail": "partnerships@nike.com",
    "country": "US",
    "updatedAt": "2026-03-21T10:04:00.000Z",
    "version": 4
  },
  "meta": { "traceId": "trc_01HQ..." }
}
```

### 19.5 `POST /assets/upload-url`

Request:

```json
{
  "fileName": "shoe-front.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 512340
}
```

Response:

```json
{
  "data": {
    "uploadUrl": "https://s3-presigned-url...",
    "storageKey": "workspace/123/assets/abc.jpg",
    "expiresInSeconds": 900
  },
  "meta": { "traceId": "trc_01HQ..." }
}
```

### 19.6 `POST /imports`

Request:

```json
{
  "entityType": "products",
  "source": {
    "type": "csv",
    "storageKey": "workspace/123/imports/products-2026-03-21.csv"
  }
}
```

Response:

```json
{
  "data": {
    "jobId": "job_01HQW...",
    "status": "queued"
  },
  "meta": { "traceId": "trc_01HQ..." }
}
```

### 19.7 `POST /billing/checkout/session`

Request:

```json
{
  "planCode": "pro_monthly",
  "provider": "stripe",
  "successUrl": "https://app.kapxr.com/billing?checkout=success",
  "cancelUrl": "https://app.kapxr.com/billing?checkout=cancel"
}
```

Response:

```json
{
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
    "sessionId": "cs_test_..."
  },
  "meta": { "traceId": "trc_01HQ..." }
}
```

---

## 20) Trade-offs and Decisions

1. **NestJS vs Express**
   - Chosen: NestJS for structure and maintainability.
   - Trade-off: slightly more boilerplate, better long-term consistency.

2. **Modular monolith first vs microservices immediately**
   - Chosen: modular monolith first.
   - Trade-off: faster delivery now, clear extraction path later.

3. **PostgreSQL-first vs polyglot persistence**
   - Chosen: PostgreSQL-first.
   - Trade-off: simpler operations now; add search store only when proven needed.

4. **Sync workflows vs queue-heavy workflows**
   - Chosen: queue for import/export/sync/webhooks.
   - Trade-off: eventual consistency in some screens, far better reliability under load.

5. **Opaque UUID IDs vs integer IDs**
   - Chosen: UUID.
   - Trade-off: larger indexes, safer distributed writes and cleaner external API surface.

---

## 21) Next Documentation Artifacts (Recommended)

- `docs/OPENAPI_SCOPE.md` - endpoint-by-endpoint schema checklist
- `docs/ERD_V1.md` - relationship diagram and index strategy
- `docs/MIGRATION_CHECKLIST.md` - frontend provider cutover checklist
- `docs/SLO_AND_OBSERVABILITY.md` - logs, metrics, traces, alerts, error budgets

