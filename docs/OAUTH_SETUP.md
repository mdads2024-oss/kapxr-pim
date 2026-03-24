# InsForge Google OAuth Setup

This project redirects Google OAuth back to the `signin` route.

## Redirect URLs to add in InsForge

Add these callback URLs in your InsForge Auth provider config for Google:

- `http://localhost:5173/signin`
- `http://localhost:8080/signin`
- `https://<github-username>.github.io/<repo-name>/signin`

For this repo, if deployed as GitHub Pages project site, it is typically:

- `https://<github-username>.github.io/kapxrpim-main/signin`

If you deploy from this monorepo path and use a different repo/page path, use that exact path instead of `kapxrpim-main`.

## InsForge Site URL / Allowed Origins

Set your frontend origins in InsForge:

- Local: `http://localhost:5173` (and `http://localhost:8080` if used)
- Production: `https://<github-username>.github.io`

## Frontend env checklist

Ensure these are set in `.env` for production build:

- `VITE_INSFORGE_BASE_URL`
- `VITE_INSFORGE_ANON_KEY`
- `VITE_INSFORGE_FUNCTION_MODE=true`
- `VITE_INSFORGE_FUNCTION_SLUG=kapxr-api`
- `VITE_WORKSPACE_SLUG=default`

## Why `/signin`

Google OAuth in `SignIn` and `SignUp` uses `redirectTo = <origin><base>/signin`, so all callbacks must include the `signin` path.
