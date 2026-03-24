# KAPXR PIM ERD (v1)

## Purpose

Define relational structure for the first production release with workspace multi-tenancy, strong catalog integrity, billing readiness, and auditability.

## Core Relationship Diagram (text)

```text
workspaces 1---* workspace_members *---1 users
workspaces 1---* brands
workspaces 1---* categories (self parent-child)
workspaces 1---* products *---0..1 brands
workspaces 1---* products *---0..1 categories
workspaces 1---* attributes
products   1---* product_attribute_values *---1 attributes
workspaces 1---* assets
products   *---* assets (via product_assets)
workspaces 1---* integrations
workspaces 1---* import_export_jobs
workspaces 1---1 subscriptions *---1 plans
workspaces 1---* invoices
workspaces 1---* audit_logs
```

---

## Entity Notes

## Tenancy

- Every business table includes `workspace_id`.
- All unique constraints are workspace-scoped where applicable.

## Identity and access

- `users` hold global identity.
- `workspace_members` maps user to workspace with role/status.

## Catalog

- `products` reference `brand_id` and `category_id`.
- `attributes` define schema-like fields.
- `product_attribute_values` stores per-product values (JSONB for flexibility).

## Assets

- Binary files remain in object storage.
- `assets` table stores metadata and delivery URLs.
- `product_assets` manages many-to-many and display order.

## Integrations

- One integration record per provider per workspace.
- Secret references point to vault/secret manager, not plain text.

## Jobs

- `import_export_jobs` tracks async workflows and status transitions.

## Billing

- `plans` are global definitions.
- `subscriptions` are workspace-level current billing state.
- `invoices` provide historical records.

## Audit

- `audit_logs` is append-only and immutable at application layer.

---

## Recommended Indexes

## High-frequency read indexes

- `products(workspace_id, status, updated_at desc)`
- `products(workspace_id, sku)`
- `products(workspace_id, category_id)`
- `products(workspace_id, brand_id)`
- `brands(workspace_id, name)`
- `categories(workspace_id, slug)`
- `assets(workspace_id, created_at desc)`
- `workspace_members(workspace_id, role, status)`
- `import_export_jobs(workspace_id, status, created_at desc)`
- `audit_logs(workspace_id, created_at desc)`
- `invoices(workspace_id, issued_at desc)`

## Uniqueness and integrity

- `products(workspace_id, sku)` unique
- `categories(workspace_id, slug)` unique
- `integrations(workspace_id, provider)` unique
- `workspace_members(workspace_id, user_id)` unique
- `subscriptions(workspace_id)` unique

---

## Data Retention Guidance

- `audit_logs`: 12-24 months online, archive older
- `import_export_jobs`: keep summary forever, raw errors configurable
- soft-delete strategy for catalog entities where restore is needed

---

## Scaling Evolution Path

1. Start with single PostgreSQL primary + read replica.
2. Add partitioning for large append-only tables (`audit_logs`, jobs) by time.
3. Add dedicated search store only when filter/search latency or relevance needs exceed PostgreSQL capabilities.
