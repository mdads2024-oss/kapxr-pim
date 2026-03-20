# KapxrPIM - Project Understanding and Build Plan

## 1) What I Understood You Are Building

You are building a **production-grade Kapxr PIM platform** (not just a basic MVP), with this delivery order:

1. Build a **fully designed, fully working frontend web app** first.
2. Use a **realistic "fully functional mock data" architecture** during frontend phase:
   - persistent local data
   - async behavior and loading states
   - CRUD flows working end-to-end
3. After frontend maturity, implement backend/services and swap data sources cleanly.

Your long-term vision (from docs) is larger than a single PIM page set: Kapxr is positioned as part of a broader commerce ecosystem (PIM + DAM + integrations + AI + workflow + governance).

## 2) Source Documents Reviewed

I carefully reviewed the attached PDFs and extracted these key goals:

- `KapxrPIM Ideation v2.pdf`
  - Core modules: Auth/Organization, Product Model, Catalog, Categories, DAM, Data Quality Score, Import Engine, AI Description, Channel import/export, Workflow approval, Search/Filters, Audit logs/versioning, trial landing, subscriptions.
  - Monetization direction: Starter/Growth/Pro tiers with storage, users, connectors, and advanced integrations.

- `Kapxr Vision.pdf`
  - Kapxr sits in a broader commerce/operations stack (PIM, DAM, CMS, OMS, inventory, payments, AI layer).
  - Platform-level ambition: central hub ("Kapxr One") and cross-domain integration.

- `KapxrPIM Competitors .pdf`
  - Competitive inspiration from Akeneo/Catsy/Salsify/Pimcore/Plytix/UnoPIM.
  - Important UX benchmarks:
    - strong onboarding flow
    - robust product grid + completeness
    - product model vs product separation
    - asset linking
    - history/workflow tracking
    - connectors and import/export operations

- `sample-local-pdf.pdf`
  - Generic sample PDF, not domain-specific for Kapxr.

## 3) Current Codebase Reality (Important)

Current project is a Vite React TS frontend with routes and polished UI pages, but **data layer is currently static/hardcoded in page files**.

### What exists now

- Modern stack: React + Vite + TypeScript + Tailwind + shadcn + React Router.
- Route structure for key screens already exists:
  - Dashboard
  - Products / Add Product / Product Detail
  - Assets
  - Categories / Attributes
  - Integrations
  - Import/Export
  - Analytics
  - Team
  - Settings
- Sidebar navigation and overall shell layout are in place.

### Gap vs your requested architecture

You referenced:
- `src/stores/usePIMStore.ts` (Zustand persist),
- `src/services/*` (async delay simulation),
- `src/lib/mockStorage.ts`,
- `mock_data_guide.md`.

These files/patterns are **not currently present in this repo snapshot**.

Meaning: the frontend currently looks good, but it is **not yet "fully functional" in the data sense**. We need to implement this architecture here.

## 4) Product Scope I Recommend for Frontend Phase

To align with your vision and keep implementation structured, frontend phase should include these functional domains:

1. **Auth + Organization shell** (trial onboarding style, role awareness, tenant context in mock layer)
2. **Products**
   - list/search/filter/sort
   - create/edit/delete
   - product vs product model
   - variant handling
3. **Attributes + Families/Schema**
4. **Categories + taxonomy assignment**
5. **DAM assets**
   - upload mock, metadata, attach/detach from products
6. **Completeness and quality scoring**
7. **Import/export jobs** (simulated async job lifecycle)
8. **Connectors/channels** (Shopify/Amazon/Walmart etc. simulated config + sync status)
9. **Workflow + approval states**
10. **Audit log + version timeline**
11. **Dashboard + PX insights**
12. **Landing/trial/onboarding UX**

## 5) Frontend Architecture Pattern (Target)

We should implement this pattern immediately and use it consistently across all modules:

### Pillar A - Typed Domain Models
- `src/types/*` for Product, ProductModel, Asset, Category, Attribute, Connector, ImportJob, WorkflowEvent, AuditEvent, User, Organization.

### Pillar B - Mock Storage + Persistence
- `src/lib/mockStorage.ts` generic utility:
  - localStorage namespace + schema versioning
  - CRUD helpers
  - reset/seed methods
  - optional migration hooks

### Pillar C - Async Service Layer
- `src/services/*Service.ts`:
  - Promise-based API with artificial latency and optional error injection
  - mirrors future backend endpoint contracts
  - all UI reads/writes go through services, not inline arrays

### State + Query Orchestration
- Use React Query for server-like data fetching patterns.
- Use Zustand (persist middleware) for app/session/workspace UI state and selected entities.
- Keep separation:
  - persistent domain data: mock storage + services
  - transient UI state: Zustand local slices

## 6) Migration Strategy to Real Backend (Planned from Day 1)

Define interface-based services now so backend migration is a provider swap, not a rewrite:

- `PIMDataProvider` interface (products, categories, assets, etc.)
- `MockPIMDataProvider` implementation for now.
- Future `ApiPIMDataProvider` implementation with same contract.

This lets us keep components unchanged when backend goes live.

## 7) Delivery Plan (Frontend First, Production-Minded)

## Phase 0 - Foundation (Immediate)
- Add architecture scaffolding:
  - `src/types`
  - `src/lib/mockStorage.ts`
  - `src/lib/delay.ts`
  - `src/services/*`
  - `src/stores/usePIMStore.ts`
- Seed realistic cross-linked dataset:
  - products <-> variants <-> categories <-> attributes <-> assets
- Add global reset and seed version controls.

## Phase 1 - Core PIM Workflows
- Products list + detail + create/edit/delete + duplicate.
- Product model + variant management.
- Completeness scoring engine (attribute-based weighted score).
- Advanced filtering/search facets.

## Phase 2 - Content + Governance
- DAM and asset linking.
- Categories/attributes schema management.
- Workflow states + approvals.
- Audit trail + version snapshots.

## Phase 3 - Commerce Operations UX
- Import/export jobs with progress states.
- Connectors config + health/sync indicators.
- Dashboard insights from mock analytics aggregates.

## Phase 4 - Production Readiness (Frontend)
- Validation, error states, skeletons, optimistic updates.
- Access control mock (roles/permissions simulation).
- Test coverage for services + critical flows.
- Performance pass + accessibility pass.

## 8) Non-Functional Targets for Frontend Build

- Realistic response timing (p50/p95 simulation by action type).
- Strong empty/loading/error/success handling on every data screen.
- Deterministic seeded data for test reproducibility.
- Offline-refresh persistence for all core entities.
- Strict TypeScript domain safety.

## 9) Risks and Decisions to Lock Early

1. **Single-tenant vs multi-tenant data model in frontend mock**  
   Recommendation: build tenant-ready now (organizationId on entities).

2. **Product model complexity level**  
   Recommendation: support at least 2-level variant matrix in frontend.

3. **Workflow strictness**  
   Recommendation: Draft -> In Review -> Approved -> Published with role checks.

4. **Connector depth in frontend phase**  
   Recommendation: start with simulated connector health + sync logs; defer deep mapping UI until Phase 3.

## 10) What "Fully Functional Mock Pattern" Means in This Project

For every key module, "fully functional" means:

- user actions mutate persistent data
- page refresh keeps changes
- async loading and success/error states feel real
- relationships are maintained (e.g., deleting category handles linked products safely)
- list/detail/forms stay consistent and reactive
- no hardcoded arrays in page components

## 11) Immediate Next Steps (How We Start)

1. Implement base data architecture files (types, mock storage, delay, services, Zustand store).
2. Refactor **Products** first as the template module for all others.
3. Refactor **Categories** and **Assets** next using same service/store pattern.
4. Add completeness score engine and workflow state machine.
5. Then continue module-by-module until all core screens are truly data-functional.

---

This gives us a frontend that is not just visually complete, but behaviorally complete and backend-ready by design.

## 12) Single-Place Theme and Color System (Your New Requirement)

Yes, this is fully possible, and we should enforce it now.

### Current status
- Good news: the app already uses token-based theming in `src/index.css` + `tailwind.config.ts` (`--primary`, `--background`, `--sidebar-*`, `--success`, etc.).
- Gap: a few places can still contain literal colors (example in `src/App.css` like `#646cffaa`, `#61dafbaa`, `#888`), and future features may accidentally add hardcoded colors unless we guard against it.

### Target rule
- **No hardcoded colors in components or feature CSS.**
- All colors must come from semantic tokens only.
- Theme/palette changes must happen from one place and reflect app-wide.

### How we will implement

1. **Single source of truth**
   - Keep all color tokens in one central theme file (CSS variables), e.g. `src/styles/theme.css` (or continue with `src/index.css` as canonical source).
   - Define semantic tokens only:
     - surfaces (`background`, `card`, `popover`)
     - text (`foreground`, `muted-foreground`)
     - intent (`primary`, `success`, `warning`, `destructive`)
     - layout-specific (`sidebar-*`)

2. **Tailwind maps only to tokens**
   - Continue mapping Tailwind colors to `hsl(var(--token))` in `tailwind.config.ts`.
   - Components use classes like `bg-primary`, `text-muted-foreground`, `border-border` only.

3. **Theme variants**
   - Keep `:root` for default + `.dark` for dark mode.
   - Add optional future brand palettes (`.theme-ocean`, `.theme-emerald`, etc.) that only override tokens.
   - Switching theme means toggling a single class on `html/body` (global effect).

4. **Hardcoded color ban**
   - Remove/replace literal hex/rgb/hsl values from app files (except the theme token file itself).
   - Add lint/CI check to detect hex/rgb/hsl literals in `src/**/*.{ts,tsx,css}` excluding theme file.

5. **Design token documentation**
   - Add `docs/design-tokens.md` with token names, meanings, and usage examples.
   - This keeps feature teams consistent and prevents random color additions.

### Outcome
- When you want a new brand palette, you only update token values in one place.
- Entire app updates automatically without touching page/component code.
- This keeps frontend production-grade and backend-independent.

## 13) Immediate App-Wide Data Consistency (Your New Requirement)

You are 100% correct: if data changes anywhere, dashboard and all related screens must reflect it immediately with no mismatch.

### Consistency goal
- **Single source of truth per entity domain**
- **Immediate UI consistency across routes/components**
- **No stale values after create/update/delete actions**

### How we will enforce this

1. **Unified data flow contract**
   - All mutations go through service layer only.
   - No direct local component mutations for shared entities.
   - Every mutation returns canonical updated entity payload.

2. **React Query cache strategy**
   - Use stable query keys by domain:
     - `["products"]`, `["product", id]`, `["dashboard-metrics"]`, etc.
   - On mutation success:
     - update exact affected caches (`setQueryData`) for instant UI
     - then invalidate dependent aggregates (`invalidateQueries`) like dashboard cards, completeness, analytics.

3. **Optimistic + rollback safety**
   - For user speed: optimistic updates on list/detail where safe.
   - On failure: rollback from mutation context + show error toast.
   - This avoids visual lag while preserving correctness.

4. **Derived data centralization**
   - Completeness scores, counters, and KPIs are computed in shared selectors/services (not duplicated in pages).
   - Dashboard always consumes these shared derived outputs, so numbers stay consistent.

5. **Event-based refresh bridge (frontend phase)**
   - Add lightweight domain event dispatcher (`entity:changed`) in mock provider.
   - Key listeners (dashboard widgets, active detail pages, side panels) trigger targeted query refresh/update.
   - Future backend can replace this with WebSocket/SSE without changing UI contracts.

6. **Cross-tab consistency**
   - Listen for browser `storage` events to rehydrate query/store state when another tab changes data.
   - Prevents mismatch between multiple open app tabs.

7. **Write ordering + versioning**
   - Add `updatedAt` and `version` on mutable entities.
   - Last-write-wins rules in mock phase; conflict handling hooks reserved for backend phase.

8. **Strict anti-stale rules**
   - Ban independent local copies of shared lists in page components.
   - Any local state must be form-draft only, never source-of-truth entity state.

### If consistency is ever missed (fallback plan)

1. Add consistency test cases first:
   - create product -> dashboard total increments immediately
   - delete category -> category counts and linked product badges update
   - update asset link -> product detail + asset library reflect instantly
2. Add a global "consistency watchdog" dev utility:
   - compares cache aggregates vs source collections in dev mode
   - logs mismatches with entity IDs and query keys
3. Add temporary hard refresh hooks per module until root mismatch is fixed.
4. Block release on any red consistency test.

### Definition of done for consistency
- No stale state across major screens after any mutation.
- Dashboard and related widgets update in same interaction cycle.
- Reload still reflects same truth (persistence aligned with cache).

## 14) Combined Skill Decision (UI/UX Pro Max + Frontend Design + System Architecture)

I have combined all three approaches and this is the final "best" direction for KapxrPIM.

### A) Product Design Direction (Frontend Design)

- **Design tone**: Enterprise premium + modern editorial minimal (clean, confident, high-clarity, not flashy/noisy).
- **Why this tone**:
  - PIM users spend long hours in dense data workflows.
  - Needs trust, readability, and speed over visual gimmicks.
  - Must still feel premium and differentiated from generic admin dashboards.
- **Core visual principle**: "Calm data density"  
  Dense information, but strong hierarchy, whitespace rhythm, and motion restraint.

### B) UX Quality Rules (UI/UX Pro Max)

These become mandatory quality gates for every page/component:

1. **Accessibility first**
   - Contrast minimum 4.5:1 for normal text.
   - Keyboard navigation + visible focus ring.
   - Labels for all form fields and icon-only buttons.

2. **Interaction quality**
   - Touch target minimum 44x44.
   - Async actions always show loading/disabled feedback.
   - Errors shown near field with clear recovery action.

3. **Performance UX**
   - Skeletons for slow data (>300ms).
   - Virtualized long tables/lists.
   - Prevent layout shift (reserve dimensions).

4. **Typography and color discipline**
   - Semantic token colors only.
   - Consistent type scale and spacing scale.
   - Avoid random shadows/radii; use standardized elevation tokens.

5. **Navigation consistency**
   - Sidebar as primary desktop nav.
   - Predictable back behavior and deep-linkable routes.
   - Preserve filter/sort/scroll state while navigating.

### C) Frontend System Architecture (System Architecture + Frontend Implementation)

- **State architecture**
  - React Query: domain data + async lifecycle.
  - Zustand: app/UI/workflow state only.
  - Context: provider wiring only (theme/auth/provider injection), not core entity state.

- **Data architecture**
  - Provider interface pattern:
    - `MockPIMProvider` (frontend phase)
    - `ApiPIMProvider` (backend phase)
  - Services call provider; components call services.
  - Swap backend at provider boundary.

- **Consistency architecture**
  - Domain query key strategy + mutation cache updates + invalidation.
  - Centralized derived metrics (dashboard/completeness/analytics).
  - Event bridge for cross-screen synchronization.

- **Scalability architecture**
  - Modular feature folders by domain (`products`, `assets`, `categories`, etc.).
  - DTO mapping layer to isolate API schema drift.
  - Audit/version/workflow modeled as first-class entities early.

### D) Best Library and Component Stack (Final Selection)

Keep and standardize on:

- UI: `shadcn/ui` + Radix
- Styling: Tailwind + semantic token system
- Motion: Framer Motion (meaningful, restrained)
- Data: TanStack Query
- App State: Zustand
- Forms: React Hook Form + Zod
- Tables: add TanStack Table + TanStack Virtual
- Charts: Recharts
- Feedback: Sonner + inline status components
- Icons: Lucide only (single icon language)

### E) Non-Negotiable Engineering Policies

1. No hardcoded colors in feature code.
2. No direct localStorage calls in pages/components.
3. No duplicated shared entity state in local component state.
4. Every mutation must update dependent views immediately.
5. Every screen must support loading/empty/error/success states.
6. Every new UI follows accessibility checklist before done.

### F) Definition of "Best in Nature" for This App

For KapxrPIM, "best" means:
- fast and visually polished,
- highly consistent across modules,
- accessible and reliable under heavy data usage,
- backend-ready without frontend rewrites,
- maintainable by team scale over time.

## 15) New Requirement Added: Pricing + PayPal Recurring Payments

You are correct to add this now. Subscription and payment architecture should be planned early so plan selection, trial, checkout, and billing state are consistent across landing + app.

### What I understand from your new requirement

1. Add a production-grade **Pricing section/page** on the landing experience.
2. Let users choose plan (Starter/Growth/Pro style tiers).
3. Integrate **PayPal recurring payments** for subscription billing.
4. Ensure architecture is backend-ready, secure, and scalable (not a temporary UI-only patch).
5. Update this understanding/plan doc first, then implement in phases.

### Scope we should deliver

- Landing pricing cards (monthly/yearly toggle, feature comparison, CTA by plan).
- Plan selection flow:
  - Unauthenticated user -> Sign up -> checkout
  - Authenticated trial user -> upgrade flow
- Checkout integration with recurring billing consent.
- Post-payment subscription activation in Kapxr workspace.
- Billing state surfaces in app (plan, renewal date, status, upgrade/downgrade/cancel).

## 16) PayPal Recurring Architecture Plan (System Design View)

### 16.1 Functional requirements

- User can view pricing and choose plan.
- User can start recurring subscription via PayPal.
- System records subscription status and entitlements.
- Failed/expired/canceled payments update account status correctly.
- Admin can view current plan and billing metadata in settings.

### 16.2 Non-functional requirements

- Security-first: no secret keys in frontend.
- Idempotent payment processing (webhook retries safe).
- Event-driven subscription state sync (eventual consistency <= seconds).
- Auditable billing timeline for support/debugging.
- Provider abstraction so Stripe/other gateways can be added later.

### 16.3 High-level components

1. **Frontend (this repo)**
   - Pricing UI + checkout entry points
   - Billing status pages
2. **Backend billing service (next phase)**
   - Setup token/payment token orchestration
   - Subscription and invoice persistence
   - Webhook receiver and signature validation
3. **PayPal APIs**
   - Setup/payment token flows and recurring payment details
4. **Data store**
   - Organizations, subscriptions, payment methods, billing events

### 16.4 Data model (backend-facing contract)

- `Plan`:
  - `id`, `code`, `name`, `billingInterval`, `price`, `currency`, `limits`, `features`
- `Subscription`:
  - `id`, `organizationId`, `planId`, `status`, `currentPeriodStart`, `currentPeriodEnd`, `cancelAtPeriodEnd`
- `PaymentMethod`:
  - `id`, `organizationId`, `provider`, `providerTokenRef`, `payerRef`, `last4` (if available), `brand`
- `BillingEvent`:
  - `id`, `organizationId`, `type`, `providerEventId`, `payloadHash`, `processedAt`
- `Invoice/Charge`:
  - `id`, `subscriptionId`, `amount`, `currency`, `status`, `providerChargeId`, `chargedAt`

### 16.5 API contract (frontend <-> backend)

- `GET /billing/plans` -> pricing catalog
- `POST /billing/checkout/session` -> create recurring checkout context for selected plan
- `POST /billing/checkout/confirm` -> finalize after payer approval redirect
- `GET /billing/subscription` -> current org subscription state
- `POST /billing/subscription/cancel` -> cancel at period end (or immediate per policy)
- `POST /billing/subscription/change-plan` -> upgrade/downgrade with proration policy

### 16.6 PayPal flow mapping

Follow PayPal recurring guidance:

1. Create setup token with recurring metadata (`usage_pattern`, `billing_plan`).
2. Get payer approval in PayPal flow.
3. Convert setup token to payment token.
4. Use payment token (`vault_id`) for recurring charges/orders.
5. Handle provider events via webhook and update subscription state.

Reference: [PayPal Recurring Payments Integration](https://developer.paypal.com/studio/checkout/standard/integrate/recurring)

### 16.7 Reliability and consistency strategy

- Webhook processing must be idempotent (`providerEventId` unique).
- Store raw event + normalized event for auditability.
- Async reconciliation job for missed webhook cases.
- Frontend uses React Query invalidation after checkout completion.
- Subscription state in app driven by backend source-of-truth, not local guess.

### 16.8 Security controls

- Frontend uses only public client configuration.
- All token creation/exchange happens server-side.
- Verify PayPal webhook signatures on backend.
- Protect billing endpoints with org/user auth and role checks.
- Never log secrets or full provider payloads with sensitive fields.

## 17) Landing Pricing UX Plan

### UX requirements

- Premium pricing section on landing:
  - clear tier differentiation
  - monthly/yearly toggle
  - "Most Popular" highlight
  - transparent feature and limits matrix
- CTA states:
  - `Start Free Trial`
  - `Choose Plan`
  - `Contact Sales` for enterprise
- Trust blocks:
  - refund/cancel policy snippet
  - secure checkout badges
  - optional FAQ accordion (billing questions)

### Conversion-focused behavior

- Keep plan cards above fold (or linked from top nav).
- Preserve selected plan through signup/login redirects.
- Route-aware CTA:
  - logged out -> signup with preselected plan
  - logged in -> direct checkout/upgrade

## 18) Implementation Phases for This New Scope

### Phase A (Frontend now, mock-first)

1. Add pricing section in landing with plan catalog from config/service.
2. Add selected-plan persistence during auth routing.
3. Add billing UI in settings (current plan, status, renew date) using mock service.
4. Keep provider interface:
   - `BillingProvider`
   - `MockBillingProvider`
   - future `ApiBillingProvider`

### Phase B (Backend + real PayPal)

1. Implement billing backend service and persistence.
2. Integrate PayPal setup token/payment token flow.
3. Add webhook endpoint and idempotent event processor.
4. Replace mock billing provider with API provider.

### Phase C (Hardening)

1. Add retries, reconciliation, and observability dashboards.
2. Add invoice history + downloadable receipts.
3. Add proration and plan-change edge-case handling.

## 19) Definition of Done for Pricing + Payments

- User can pick a plan from landing and complete recurring subscription flow.
- Subscription status and limits reflect correctly in-app.
- Cancellations and renewals are reflected without manual intervention.
- Billing failures are visible and recoverable.
- Architecture supports adding another gateway without rewriting UI.
