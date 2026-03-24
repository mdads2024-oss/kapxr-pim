# KAPXR PIM OpenAPI Scope (v1)

## Goal

Define the endpoint-by-endpoint OpenAPI scope required to migrate frontend data sources from mock providers to production APIs with no major UI rewrite.

Base URL: `/api/v1`

## Global API Standards

- Auth: `Authorization: Bearer <access_token>`
- Tenant: resolved from token/workspace membership
- Success envelope:
  - `data` object/array
  - `meta` object (`traceId`, pagination where applicable)
- Error envelope:
  - `error.code`
  - `error.message`
  - `error.details[]`
  - `error.traceId`
- Pagination query:
  - `page`, `limit`, `sort`, `order`

---

## 1. Auth

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/signout`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Schema checklist:
- Request/response DTOs
- Token/session model
- Password rules and error codes

## 2. Team

- `GET /team/members`
- `POST /team/members`
- `PATCH /team/members/{id}`
- `DELETE /team/members/{id}`
- `POST /team/invitations`
- `GET /team/invitations`
- `DELETE /team/invitations/{id}`

Schema checklist:
- Role enum: `admin | editor | viewer`
- Status enum: `active | invited`

## 3. Products

- `GET /products`
- `GET /products/{id}`
- `POST /products`
- `PATCH /products/{id}`
- `DELETE /products/{id}`
- `POST /products/{id}/publish`
- `POST /products/{id}/unpublish`

Schema checklist:
- Filter params: `search`, `status`, `categoryId`, `brandId`, `completenessMin`, `completenessMax`
- SKU uniqueness error contract
- Optimistic concurrency (`version`)

## 4. Brands

- `GET /brands`
- `GET /brands/{id}`
- `POST /brands`
- `PATCH /brands/{id}`
- `DELETE /brands/{id}`

Schema checklist:
- Contact fields
- Status enum
- Versioned update semantics

## 5. Categories

- `GET /categories`
- `GET /categories/{id}`
- `POST /categories`
- `PATCH /categories/{id}`
- `DELETE /categories/{id}`
- `GET /categories/tree` (optional)

Schema checklist:
- Parent-child hierarchy
- Slug uniqueness per workspace

## 6. Attributes

- `GET /attributes`
- `GET /attributes/{id}`
- `POST /attributes`
- `PATCH /attributes/{id}`
- `DELETE /attributes/{id}`

Schema checklist:
- Type enum (`text`, `rich_text`, `number`, `select`, `multi_select`)
- Options payload structure

## 7. Assets

- `GET /assets`
- `GET /assets/{id}`
- `POST /assets/upload-url`
- `POST /assets`
- `PATCH /assets/{id}`
- `DELETE /assets/{id}`
- `POST /assets/{id}/attach` (optional)
- `POST /assets/{id}/detach` (optional)

Schema checklist:
- Signed upload flow contract
- Metadata normalization (`sizeBytes`, mime, dimensions)

## 8. Integrations

- `GET /integrations`
- `PATCH /integrations/{id}`
- `POST /integrations/{id}/connect`
- `POST /integrations/{id}/disconnect`
- `POST /integrations/{id}/sync`
- `GET /integrations/{id}/logs`

Schema checklist:
- Provider enum and config schema
- Secret redaction contract

## 9. Import/Export

- `GET /import-export/history`
- `POST /import-export/history` (temporary compatibility)
- `POST /imports`
- `GET /imports/{jobId}`
- `GET /exports`
- `POST /exports`
- `GET /exports/{jobId}`

Schema checklist:
- Job status enum (`queued`, `running`, `completed`, `failed`)
- Record count + failure details

## 10. Analytics

- `GET /analytics/metrics`
- `GET /analytics/summary`
- `GET /analytics/trends`

Schema checklist:
- Date range filters
- Metric key naming conventions

## 11. Billing

- `GET /billing/plans`
- `GET /billing/subscription`
- `POST /billing/checkout/session`
- `POST /billing/subscription/change-plan`
- `POST /billing/subscription/cancel`
- `POST /billing/subscription/resume`
- `GET /billing/invoices`
- `GET /billing/usage`
- `POST /billing/webhooks/{provider}` (provider callback)

Schema checklist:
- Provider abstraction (`stripe`, `paypal`, `razorpay`)
- Webhook idempotency header and replay strategy

## 12. Activity / Audit / Settings

- `GET /activity/logs`
- `GET /audit/logs`
- `GET /settings`
- `PATCH /settings`
- `GET /help/faqs` (optional content API)
- `GET /help/tutorials` (optional content API)
- `GET /workflows/templates` (optional content API)

---

## OpenAPI Delivery Checklist

1. Create tags by domain (`Auth`, `Products`, `Brands`, etc.)
2. Define reusable components:
   - `ErrorResponse`
   - `PaginationMeta`
   - `TraceMeta`
3. Add security schemes (bearer + refresh flow docs)
4. Document all enums explicitly
5. Add example payloads for each write endpoint
6. Add 4xx/5xx responses for each path
7. Version as `v1.0.0` and lock for frontend integration
