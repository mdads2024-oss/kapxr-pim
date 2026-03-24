# InsForge Backend Setup for KAPXR PIM

## What was provisioned using InsForge MCP

This project has been provisioned on InsForge using MCP tools:

- Created core schema tables for KAPXR PIM (frontend-compatible shape)
- Seeded default workspace and billing plans
- Created storage bucket: `kapxr-assets` (public)
- Deployed edge function: `kapxr-api` (status: active)

## Created backend resources

### Tables

- `workspaces`
- `workspace_members`
- `team_members`
- `brands`
- `categories`
- `products`
- `attributes`
- `assets`
- `integrations`
- `import_export_history`
- `analytics_metrics`
- `billing_plans`
- `workspace_subscriptions`

### Edge function

- Slug: `kapxr-api`
- Source file: `insforge/functions/kapxr-api.js`
- Purpose: compatibility API for existing frontend paths like `/products`, `/categories`, `/billing/plans`, etc.

### Storage

- Bucket: `kapxr-assets`

## Frontend integration mode

To use InsForge function mode with current providers (`apiPimProvider` / `apiBillingProvider`):

1. Set:
   - `VITE_PIM_DATA_SOURCE=api`
   - `VITE_BILLING_DATA_SOURCE=api`
2. Set function endpoint as API base URL:
   - `VITE_API_BASE_URL=https://esnz8w84.us-east.insforge.app/api/functions/kapxr-api`
3. Enable function mode:
   - `VITE_INSFORGE_FUNCTION_MODE=true`
4. Set InsForge SDK values:
   - `VITE_INSFORGE_BASE_URL=https://esnz8w84.us-east.insforge.app`
   - `VITE_INSFORGE_FUNCTION_SLUG=kapxr-api`
   - `VITE_INSFORGE_ANON_KEY=<insforge-anon-key>`
5. Set workspace:
   - `VITE_WORKSPACE_SLUG=default`
6. Optional bearer token:
   - `VITE_INSFORGE_BEARER_TOKEN=<token>`

## Auth note

Current frontend auth is localStorage-based. InsForge Auth SDK is available and should replace local auth in the next phase:

- `signUp`
- `signInWithPassword`
- `getCurrentSession`
- `signOut`

## Known gaps to finish next

- `src/services/providers/apiPimProvider.ts` brand methods are still unimplemented in frontend code and must be wired to API client calls.
- Billing currently supports core subscription flow in edge function; invoice and usage endpoints can be expanded further.
- Team member payload shape in UI may require mapping to `workspace_members` schema (`user_id`, role/status).

## Recommended immediate next step

Implement missing brand APIs in `apiPimProvider`, switch `.env` to InsForge function mode, and run end-to-end CRUD verification for:
- products
- brands
- categories
- assets
- attributes
- integrations
- billing
