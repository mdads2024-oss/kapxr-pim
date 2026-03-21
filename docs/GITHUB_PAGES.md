# Deploy Kapxr PIM to GitHub Pages

Use **the same GitHub account**; create a **new repository** whose name becomes part of the URL.

## 1. Create the repository on GitHub

1. GitHub → **New repository**
2. Name it (example: `kapxr-pim`). The live site will be:
   - `https://<your-username>.github.io/kapxr-pim/`
3. Leave it empty (no README) or add a README — either is fine.

## 2. Push this app as the repo root

From the **`kapxrpim-main`** folder (where `package.json` and `.github/` live):

```bash
git init
git add .
git commit -m "Initial commit — Kapxr PIM"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git push -u origin main
```

Replace `<YOUR_USERNAME>` and `<YOUR_REPO_NAME>` (must match the repo name exactly — same as in the URL).

## 3. Turn on GitHub Pages (GitHub Actions)

1. Repo → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**: choose **GitHub Actions**
3. Save if needed

The workflow **Deploy to GitHub Pages** runs on every push to `main` or `master`.

## 4. First deploy

After the first successful workflow run:

- Open **Actions** → confirm the workflow is green
- Site URL: **Settings → Pages** (or the link in the workflow summary)

## Important: repo name = base path

The workflow sets:

`VITE_BASE_PATH: /<repository-name>/`

So the **GitHub repo name** must stay in sync with that path. If you rename the repo, update either:

- the repo name (simplest), or  
- edit `.github/workflows/deploy-github-pages.yml` and set `VITE_BASE_PATH` manually.

## Local preview of a GitHub Pages build

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build:gh-pages
npx vite preview
```

## User site (`username.github.io`) with project at root

If the repo is **`yourusername.github.io`** and the app is at the root, the base path should be `/`, not `/repo/`. In the workflow, change the build step to:

```yaml
env:
  VITE_BASE_PATH: /
```

and remove the `cp` in `build:gh-pages` only if you don’t need the SPA `404.html` trick (you still need it for deep links unless you use hash routing).
