# SLO and Observability Plan (v1)

## Goal

Define measurable reliability targets and the telemetry needed to operate KAPXR PIM backend safely at scale.

---

## 1) Service Level Objectives (SLOs)

## 1.1 Availability SLO

- API availability target: **99.9% monthly**
- Error budget: ~43.2 minutes/month

## 1.2 Latency SLOs

- Read endpoints (`GET` list/detail):
  - p95 < 300 ms
  - p99 < 800 ms
- Write endpoints (`POST/PATCH/DELETE`):
  - p95 < 500 ms
  - p99 < 1200 ms
- Async job enqueue:
  - p95 < 250 ms

## 1.3 Data and workflow SLOs

- Import/export job completion success: >= 99.5%
- Billing webhook processing success (with retry): >= 99.9%
- Audit logging delivery: >= 99.99%

---

## 2) SLIs (What to Measure)

## Request-level SLIs

- Request rate (RPS)
- Success rate (2xx/3xx)
- Error rate (4xx/5xx split)
- Latency percentiles (p50/p95/p99)

## Dependency SLIs

- PostgreSQL:
  - query latency
  - connection pool saturation
  - lock wait time
- Redis:
  - command latency
  - memory pressure and evictions
- Queue:
  - queue depth
  - job lag age
  - retries/dead-letter counts
- External:
  - payment provider success/failure
  - integration API timeout/failure rates

---

## 3) Logging Standards

## 3.1 Structured logs (JSON only)

Required fields:
- `timestamp`
- `level`
- `service`
- `env`
- `traceId`
- `requestId`
- `workspaceId` (if available)
- `userId` (if available)
- `route`
- `method`
- `statusCode`
- `durationMs`
- `errorCode` (if failure)

## 3.2 Log levels

- `INFO`: normal business events
- `WARN`: retries, rate-limit hits, non-fatal degradations
- `ERROR`: failed requests/jobs
- `FATAL`: startup/runtime conditions requiring immediate action

## 3.3 Redaction policy

- Never log:
  - passwords
  - tokens
  - secrets/API keys
  - full payment payload sensitive fields

---

## 4) Tracing

- Use distributed tracing across:
  - API request lifecycle
  - DB calls
  - Redis operations
  - queue publish/consume
  - external provider calls
- Propagate `traceId` through synchronous and async paths.

Key spans:
- `http.request`
- `db.query`
- `cache.get/cache.set`
- `queue.enqueue/queue.process`
- `provider.call`

---

## 5) Metrics Dashboard Layout

## 5.1 API dashboard

- RPS by route
- latency p50/p95/p99 by route
- error rate by route and code
- top failing endpoints

## 5.2 Platform dashboard

- CPU/memory by pod
- container restart count
- DB health and connection pool
- Redis memory/evictions

## 5.3 Jobs dashboard

- queue depth by queue name
- oldest job age
- retries and dead-letter counts
- job success/failure rate

## 5.4 Billing/integration dashboard

- webhook ingestion rate
- webhook failures by provider
- external API timeout rate

---

## 6) Alerting Policy

## 6.1 Critical (page immediately)

- API availability < 99% over 10 min
- p95 latency > 2x SLO for 15 min
- 5xx error rate > 5% over 5 min
- DB unavailable / connection exhaustion
- webhook processing halted

## 6.2 High (urgent but non-paging in off-hours if policy allows)

- queue lag > 15 min
- dead-letter growth spike
- Redis eviction spikes
- sustained integration provider failures

## 6.3 Medium (ticket + follow-up)

- increasing p99 trend
- top endpoint error code drift
- audit log ingestion delay

---

## 7) Error Budget Policy

- Track monthly error budget burn.
- If burn rate exceeds 50% mid-cycle:
  - pause non-critical feature releases
  - prioritize reliability fixes
- If burn exceeds 100%:
  - reliability-only sprint until SLO returns to target

---

## 8) Runbooks (Required)

Create and maintain runbooks for:

1. API 5xx spike
2. Database saturation
3. Redis outage/degradation
4. Queue backlog growth
5. Payment webhook delays/failures
6. Integration provider outage

Each runbook must include:
- Symptom detection
- Triage checklist
- Mitigation actions
- Rollback criteria
- Communication template

---

## 9) Minimal Tooling Stack

- Logs: centralized structured log store
- Metrics: Prometheus-compatible collector + Grafana dashboards
- Tracing: OpenTelemetry instrumentation with trace backend
- Alerting: on-call paging + incident channel notifications

---

## 10) Definition of Done for Observability

- All production APIs emit trace IDs and structured logs
- Dashboards cover API, DB, Redis, queues, billing webhooks
- SLOs and SLIs published and reviewed with team
- Alert rules tested with synthetic failures
- Runbooks validated in staging game-day exercises
