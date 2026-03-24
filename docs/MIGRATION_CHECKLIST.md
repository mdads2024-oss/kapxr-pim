# Mock to API Migration Checklist

## Goal

Move `kapxrpim-main` from mock/localStorage providers to real APIs with controlled risk and no broad UI rewrite.

---

## Phase 0 - Contract and Environment Readiness

- [ ] Freeze API v1 scope from `docs/OPENAPI_SCOPE.md`
- [ ] Finalize enums and field naming alignment with frontend types
- [ ] Publish mock API examples for frontend integration testing
- [ ] Configure environments:
  - [ ] local
  - [ ] dev
  - [ ] staging
  - [ ] production
- [ ] Set `VITE_API_BASE_URL` per environment
- [ ] Keep feature flag/data source switch (`mock` vs `api`)

---

## Phase 1 - Foundation APIs

- [ ] Implement auth endpoints (`signup`, `signin`, `refresh`, `me`, `signout`)
- [ ] Implement workspace membership + role checks
- [ ] Implement standardized error envelope
- [ ] Implement request validation and DTO schema checks
- [ ] Add trace IDs to every response

Frontend readiness:
- [ ] Replace localStorage-only auth check with backend-backed session flow
- [ ] Add global unauthorized/forbidden handling in API client

---

## Phase 2 - Core PIM Parity

- [ ] Products endpoints complete
- [ ] Categories endpoints complete
- [ ] Attributes endpoints complete
- [ ] Assets endpoints complete
- [ ] Brands endpoints complete (critical gap today)

Frontend verification:
- [ ] `apiPimProvider` implements all `PIMProvider` methods
- [ ] React Query hooks work without mock fallback
- [ ] CRUD and invalidation behavior unchanged from user perspective

---

## Phase 3 - Team, Integrations, Import/Export

- [ ] Team member and invitation APIs
- [ ] Integrations connect/disconnect/sync APIs
- [ ] Import/export job APIs (queue-backed)
- [ ] Job status polling contracts

Frontend verification:
- [ ] Team screens fully API-backed
- [ ] Integrations state updates persist across reload
- [ ] Import/export history sourced from backend jobs

---

## Phase 4 - Analytics, Activity, Settings

- [ ] Dashboard metrics API
- [ ] Activity logs API
- [ ] Settings read/write API
- [ ] Optional help/workflow template content APIs

Frontend verification:
- [ ] Remove page-level hardcoded datasets where backend exists
- [ ] Add empty/loading/error states for all new API-backed modules

---

## Phase 5 - Billing Hardening

- [ ] Plans/subscription APIs
- [ ] Checkout session flow
- [ ] Cancel/resume/change-plan
- [ ] Invoices and usage APIs
- [ ] Provider webhooks with idempotency

Frontend verification:
- [ ] Billing UI reflects backend truth
- [ ] Manual refresh and webhook eventual-consistency messaging added

---

## Cross-Cutting Engineering Checklist

## Security

- [ ] RBAC enforcement per route
- [ ] Secrets moved to secure manager
- [ ] Rate limiting on auth and mutation endpoints
- [ ] Audit logs for destructive or billing operations

## Data consistency

- [ ] UUID ID strategy finalized
- [ ] Optimistic concurrency/version checks for updates
- [ ] Soft delete policy defined and consistent

## Performance

- [ ] Pagination added to all list endpoints
- [ ] Redis cache for hot reads
- [ ] Queue offloading for heavy operations
- [ ] Critical DB indexes validated

## Observability

- [ ] Structured logs with trace IDs
- [ ] Metrics dashboards
- [ ] Alerts for error spikes, queue lag, DB saturation

---

## Release Gates

## Dev gate

- [ ] 100% provider method parity against frontend interfaces
- [ ] No major UI regressions in smoke test

## Staging gate

- [ ] End-to-end test suite pass
- [ ] Load test baseline achieved
- [ ] Webhook and retry paths validated

## Production gate

- [ ] Feature flag rollout strategy approved
- [ ] Rollback plan documented
- [ ] On-call runbook prepared

---

## Rollout Strategy

1. Dark launch backend behind feature flag.
2. Enable API mode for internal users/workspaces.
3. Ramp by workspace cohorts.
4. Monitor SLOs/error budgets continuously.
5. Remove mock path only after stable production window.
