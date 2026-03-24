import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@insforge/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const parseEnvFile = (filePath) => {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  const out = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    out[key] = value;
  }
  return out;
};

const envPath = path.join(projectRoot, ".env");
if (!fs.existsSync(envPath)) {
  console.error("Missing .env file");
  process.exit(1);
}

const env = parseEnvFile(envPath);
const baseUrl = env.VITE_INSFORGE_BASE_URL;
const anonKey = env.VITE_INSFORGE_ANON_KEY;
const functionSlug = env.VITE_INSFORGE_FUNCTION_SLUG || "kapxr-api";
const workspaceSlug = env.VITE_WORKSPACE_SLUG || "default";

if (!baseUrl || !anonKey) {
  console.error("Missing VITE_INSFORGE_BASE_URL or VITE_INSFORGE_ANON_KEY in .env");
  process.exit(1);
}

const insforge = createClient({
  baseUrl,
  anonKey,
});

const checks = [
  { name: "billing plans", path: "billing/plans", method: "GET" },
  { name: "billing subscription", path: "billing/subscription", method: "GET" },
  { name: "products list", path: "products", method: "GET" },
  { name: "brands list", path: "brands", method: "GET" },
  { name: "categories list", path: "categories", method: "GET" },
  { name: "assets list", path: "assets", method: "GET" },
  { name: "attributes list", path: "attributes", method: "GET" },
  { name: "integrations list", path: "integrations", method: "GET" },
  { name: "team members list", path: "team/members", method: "GET" },
  { name: "analytics metrics", path: "analytics/metrics", method: "GET" },
  { name: "import/export history", path: "import-export/history", method: "GET" },
  { name: "activity logs", path: "activity/logs", method: "GET" },
  { name: "workflow steps", path: "workflows/steps", method: "GET" },
  { name: "help faqs", path: "help/faqs", method: "GET" },
  { name: "help tutorials", path: "help/tutorials", method: "GET" },
  { name: "landing content", path: "landing/content", method: "GET" },
  { name: "admin me", path: "admin/me", method: "GET" },
  { name: "billing usage", path: "billing/usage", method: "GET" },
  { name: "billing invoices", path: "billing/invoices", method: "GET" },
];

let failed = 0;
for (const check of checks) {
  const { data, error } = await insforge.functions.invoke(functionSlug, {
    method: check.method,
    headers: {
      "X-Workspace-Slug": workspaceSlug,
      "X-Route-Path": check.path,
    },
    body: undefined,
  });

  if (error) {
    failed += 1;
    const code = error.error || error.code || "UNKNOWN";
    console.error(`FAIL: ${check.name} (${check.path}) -> ${code} ${error.message || ""}`);
    continue;
  }

  const size = Array.isArray(data) ? data.length : data ? 1 : 0;
  console.log(`PASS: ${check.name} (${check.path}) -> ${size} record(s)`);
}

const newsletterProbeEmail = `healthcheck+${Date.now()}@kapxr.app`;
const newsletterProbe = await insforge.functions.invoke(functionSlug, {
  method: "POST",
  headers: {
    "X-Workspace-Slug": workspaceSlug,
    "X-Route-Path": "newsletter/subscribe",
  },
  body: { email: newsletterProbeEmail },
});

if (newsletterProbe.error) {
  failed += 1;
  const code = newsletterProbe.error.error || newsletterProbe.error.code || "UNKNOWN";
  console.error(`FAIL: newsletter subscribe -> ${code} ${newsletterProbe.error.message || ""}`);
} else {
  console.log("PASS: newsletter subscribe -> 1 record inserted");
}

if (failed > 0) {
  console.error(`InsForge health check failed (${failed}/${checks.length + 1})`);
  process.exit(1);
}

console.log(`InsForge health check passed (${checks.length + 1}/${checks.length + 1})`);
