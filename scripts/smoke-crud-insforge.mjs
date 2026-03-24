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

const env = parseEnvFile(path.join(projectRoot, ".env"));
const baseUrl = env.VITE_INSFORGE_BASE_URL;
const anonKey = env.VITE_INSFORGE_ANON_KEY;
const functionSlug = env.VITE_INSFORGE_FUNCTION_SLUG || "kapxr-api";
const workspaceSlug = env.VITE_WORKSPACE_SLUG || "default";

if (!baseUrl || !anonKey) {
  console.error("Missing VITE_INSFORGE_BASE_URL or VITE_INSFORGE_ANON_KEY in .env");
  process.exit(1);
}

const insforge = createClient({ baseUrl, anonKey });

const invoke = async (route, method, body) => {
  const { data, error } = await insforge.functions.invoke(functionSlug, {
    method,
    headers: {
      "X-Workspace-Slug": workspaceSlug,
      "X-Route-Path": route,
      "X-User-Email": "admin@kapxr.ai",
    },
    body: body ?? undefined,
  });
  if (error) throw new Error(`${method} ${route} failed: ${error.message}`);
  return data;
};

const nowToken = Date.now();
let failures = 0;

const safe = async (name, fn) => {
  try {
    await fn();
    console.log(`PASS: ${name}`);
  } catch (err) {
    failures += 1;
    console.error(`FAIL: ${name} -> ${err instanceof Error ? err.message : String(err)}`);
  }
};

await safe("brands CRUD with logo", async () => {
  const created = await invoke("brands", "POST", {
    name: `Smoke Brand ${nowToken}`,
    description: "Smoke test",
    website: "https://example.com",
    status: "Active",
    products: 0,
    logo: null,
    contact_email: "brand@example.com",
    contact_phone: "123456",
    country: "India",
    created_at: "Mar 24, 2026",
    updated_at: "Mar 24, 2026",
    created_by: "Smoke",
  });
  await invoke(`brands/${created.id}`, "PATCH", { logo: "data:image/png;base64,smoke" });
  await invoke(`brands/${created.id}`, "DELETE");
});

await safe("categories CRUD", async () => {
  const created = await invoke("categories", "POST", {
    name: `Smoke Category ${nowToken}`,
    products: 0,
    subcategories: ["One", "Two"],
  });
  await invoke(`categories/${created.id}`, "PATCH", { name: `Smoke Category Updated ${nowToken}` });
  await invoke(`categories/${created.id}`, "DELETE");
});

await safe("products CRUD", async () => {
  const created = await invoke("products", "POST", {
    name: `Smoke Product ${nowToken}`,
    sku: `SMOKE-${nowToken}`,
    category: "General",
    status: "Draft",
    completeness: 10,
    channels: 0,
    image: null,
  });
  await invoke(`products/${created.id}`, "PATCH", { status: "Published", completeness: 95 });
  await invoke(`products/${created.id}`, "DELETE");
});

await safe("assets CRUD (upload metadata)", async () => {
  const created = await invoke("assets", "POST", {
    name: `Smoke Asset ${nowToken}.png`,
    type: "Image",
    size: "0.1 MB",
    dimensions: "100x100",
    tags: ["smoke"],
    date: "Mar 24, 2026",
  });
  await invoke(`assets/${created.id}`, "PATCH", { tags: ["smoke", "updated"] });
  await invoke(`assets/${created.id}`, "DELETE");
});

await safe("attributes CRUD", async () => {
  const created = await invoke("attributes", "POST", {
    name: `Smoke Attribute ${nowToken}`,
    type: "Text",
    group: "General",
    values: null,
    required: false,
    categories: [],
  });
  await invoke(`attributes/${created.id}`, "PATCH", { required: true });
  await invoke(`attributes/${created.id}`, "DELETE");
});

await safe("team members CRUD", async () => {
  const created = await invoke("team/members", "POST", {
    name: "Smoke User",
    email: `smoke-${nowToken}@example.com`,
    role: "Viewer",
    status: "Invited",
    initials: "SU",
  });
  await invoke(`team/members/${created.id}`, "PATCH", { status: "Active" });
  await invoke(`team/members/${created.id}`, "DELETE");
});

await safe("integrations list/update", async () => {
  const list = await invoke("integrations", "GET");
  if (!Array.isArray(list) || list.length === 0) return;
  const first = list[0];
  await invoke(`integrations/${first.id}`, "PATCH", {
    connected: Boolean(first.connected),
    status: first.connected ? "Connected" : "Not Connected",
  });
});

await safe("import/export history create/list", async () => {
  await invoke("import-export/history", "POST", {
    name: `Smoke Import ${nowToken}`,
    type: "Import",
    status: "Completed",
    records: 1,
    date: "Mar 24, 2026",
    time: "10:00 AM",
  });
  const list = await invoke("import-export/history", "GET");
  if (!Array.isArray(list)) throw new Error("History response is not an array");
});

await safe("analytics and billing reads", async () => {
  await invoke("analytics/metrics", "GET");
  await invoke("billing/plans", "GET");
  await invoke("billing/subscription", "GET");
  await invoke("billing/usage", "GET");
  await invoke("billing/invoices", "GET");
});

if (failures > 0) {
  console.error(`Smoke test failed (${failures})`);
  process.exit(1);
}

console.log("Smoke test passed (all checks)");
