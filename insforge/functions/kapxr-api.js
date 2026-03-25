module.exports = async function(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Workspace-Slug, X-Route-Path, X-User-Email",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const { createClient } = await import("npm:@insforge/sdk");
  const client = createClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    anonKey: Deno.env.get("ANON_KEY"),
  });

  const url = new URL(request.url);
  const route = (
    url.searchParams.get("path") ||
    request.headers.get("X-Route-Path") ||
    ""
  ).replace(/\/+$/, "");
  const segments = route.split("/").filter(Boolean);
  const resource = segments[0];
  const id = segments[1];
  const workspaceSlug = request.headers.get("X-Workspace-Slug") || "default";
  const userEmail = (request.headers.get("X-User-Email") || "").trim().toLowerCase();

  const { data: wsRows, error: wsError } = await client.database
    .from("workspaces")
    .select("id")
    .eq("slug", workspaceSlug)
    .limit(1);
  if (wsError || !wsRows || wsRows.length === 0) {
    return json({ error: "Workspace not found" }, 404);
  }
  const workspaceId = wsRows[0].id;

  const isWorkspaceAdmin = async () => {
    if (!userEmail) return false;
    const { data, error } = await client.database
      .from("admin_users")
      .select("id")
      .eq("workspace_id", workspaceId)
      .eq("email", userEmail)
      .eq("is_active", true)
      .limit(1);
    if (error) return false;
    return Boolean(data && data.length > 0);
  };

  const parseBody = async () => {
    try {
      return await request.json();
    } catch (_err) {
      return {};
    }
  };

  const tableMap = {
    products: "products",
    brands: "brands",
    categories: "categories",
    assets: "assets",
    attributes: "attributes",
    integrations: "integrations",
    "team/members": "team_members",
  };

  const listFrom = async (table) => {
    const { data, error } = await client.database.from(table).select().eq("workspace_id", workspaceId);
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  };

  if (route === "analytics/metrics" && request.method === "GET") {
    const { data, error } = await client.database
      .from("analytics_metrics")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: false });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "activity/logs" && request.method === "GET") {
    const { data, error } = await client.database
      .from("activity_logs")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: false });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "workflows/steps" && request.method === "GET") {
    const { data, error } = await client.database
      .from("workflow_steps")
      .select()
      .eq("workspace_id", workspaceId)
      .order("position", { ascending: true });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "help/faqs" && request.method === "GET") {
    const { data, error } = await client.database
      .from("help_faqs")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: true });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "help/tutorials" && request.method === "GET") {
    const { data, error } = await client.database
      .from("help_tutorials")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: true });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "landing/content" && request.method === "GET") {
    const { data, error } = await client.database
      .from("landing_content")
      .select()
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "landing/content" && request.method === "PATCH") {
    if (!(await isWorkspaceAdmin())) return json({ error: "Admin access required" }, 403);
    const body = await parseBody();
    const { data: currentRows, error: currentError } = await client.database
      .from("landing_content")
      .select("id")
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (currentError || !currentRows || currentRows.length === 0) {
      return json({ error: "Landing content not found" }, 404);
    }
    const { data, error } = await client.database
      .from("landing_content")
      .update({ ...body })
      .eq("id", currentRows[0].id)
      .select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "admin/me" && request.method === "GET") {
    const admin = await isWorkspaceAdmin();
    return json({ email: userEmail || null, isAdmin: admin });
  }

  if (route === "admin/users" && request.method === "GET") {
    if (!(await isWorkspaceAdmin())) return json({ error: "Admin access required" }, 403);
    const { data, error } = await client.database
      .from("admin_users")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: true });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "admin/config" && request.method === "GET") {
    if (!(await isWorkspaceAdmin())) return json({ error: "Admin access required" }, 403);
    const { data, error } = await client.database
      .from("admin_settings")
      .select()
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "admin/config" && request.method === "PATCH") {
    if (!(await isWorkspaceAdmin())) return json({ error: "Admin access required" }, 403);
    const body = await parseBody();
    const { data: currentRows, error: currentError } = await client.database
      .from("admin_settings")
      .select("id")
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (currentError || !currentRows || currentRows.length === 0) {
      return json({ error: "Admin settings not found" }, 404);
    }
    const { data, error } = await client.database
      .from("admin_settings")
      .update({ ...body })
      .eq("id", currentRows[0].id)
      .select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "admin/billing/plans" && request.method === "GET") {
    if (!(await isWorkspaceAdmin())) return json({ error: "Admin access required" }, 403);
    const { data, error } = await client.database.from("billing_plans").select().order("id", { ascending: true });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (resource === "admin" && segments[1] === "billing" && segments[2] === "plans" && segments[3] && request.method === "PATCH") {
    if (!(await isWorkspaceAdmin())) return json({ error: "Admin access required" }, 403);
    const planId = segments[3];
    const body = await parseBody();
    const { data, error } = await client.database
      .from("billing_plans")
      .update({ ...body })
      .eq("id", planId)
      .select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "support/tickets" && request.method === "POST") {
    const body = await parseBody();
    const payload = {
      workspace_id: workspaceId,
      subject: body?.subject || "",
      description: body?.description || "",
      priority: body?.priority || "Medium",
      status: "open",
    };
    const { data, error } = await client.database.from("support_tickets").insert([payload]).select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null, 201);
  }

  if (route === "import-export/history" && request.method === "GET") {
    const { data, error } = await client.database
      .from("import_export_history")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: false });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "import-export/history" && request.method === "POST") {
    const body = await parseBody();
    const payload = { ...body, workspace_id: workspaceId };
    const { data, error } = await client.database.from("import_export_history").insert([payload]).select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "newsletter/subscribe" && request.method === "POST") {
    const body = await parseBody();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email) return json({ error: "Email is required" }, 400);

    const { data, error } = await client.database
      .from("newsletter_subscribers")
      .insert([{ workspace_id: workspaceId, email, source: "landing_page" }])
      .select();

    if (error) {
      const message = (error.message || "").toLowerCase();
      if (message.includes("unique") || message.includes("duplicate")) {
        return json({ error: "Already subscribed" }, 409);
      }
      return json({ error: error.message }, 400);
    }
    return json((data || [])[0] || null, 201);
  }

  if (route === "billing/plans" && request.method === "GET") {
    const { data, error } = await client.database.from("billing_plans").select().order("monthly_price");
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (route === "billing/subscription" && request.method === "GET") {
    const { data, error } = await client.database
      .from("workspace_subscriptions")
      .select()
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (route === "billing/usage" && request.method === "GET") {
    const { data, error } = await client.database
      .from("billing_usage")
      .select()
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || { storageUsedGb: 0, seatsUsed: 0, connectorsUsed: 0 });
  }

  if (route === "billing/invoices" && request.method === "GET") {
    const { data, error } = await client.database
      .from("billing_invoices")
      .select()
      .eq("workspace_id", workspaceId)
      .order("id", { ascending: false });
    if (error) return json({ error: error.message }, 400);
    return json(data || []);
  }

  if (
    route === "billing/checkout/session" ||
    route === "billing/subscription/change-plan" ||
    route === "billing/subscription/cancel" ||
    route === "billing/subscription/resume"
  ) {
    const body = await parseBody();
    const { data: currentRows, error: currentError } = await client.database
      .from("workspace_subscriptions")
      .select()
      .eq("workspace_id", workspaceId)
      .limit(1);
    if (currentError || !currentRows || currentRows.length === 0) {
      return json({ error: "Subscription not found" }, 404);
    }
    const current = currentRows[0];
    /** @type {Record<string, unknown>} */
    const patch = {};
    if (route.includes("change-plan") || route.includes("checkout")) {
      if (body?.planCode) patch["plan_code"] = body.planCode;
      if (body?.interval) patch["billing_interval"] = body.interval;
      if (body?.provider) patch["provider"] = body.provider;
      patch["status"] = "active";
    }
    if (route.endsWith("/cancel")) patch["status"] = "canceled";
    if (route.endsWith("/resume")) patch["status"] = "active";

    const { data, error } = await client.database
      .from("workspace_subscriptions")
      .update(patch)
      .eq("id", current.id)
      .select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  // Store attribute values for a product
  // POST /products/:id/attribute-values
  if (route.startsWith("products/") && route.endsWith("/attribute-values") && request.method === "POST") {
    const productId = segments[1];
    const body = await parseBody();
    const incomingValues = Array.isArray(body?.values) ? body.values : [];

    // Replace values atomically: clear then re-insert
    const { error: deleteError } = await client.database
      .from("product_attribute_values")
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("product_id", productId);
    if (deleteError) return json({ error: deleteError.message }, 400);

    const rows = incomingValues
      .map((v) => {
        const attributeId = v?.attribute_id ?? v?.attributeId;
        if (!attributeId) return null;
        const rawValue = v?.value;
        const value =
          rawValue === undefined
            ? null
            : typeof rawValue === "string"
              ? rawValue
              : JSON.stringify(rawValue);
        return {
          workspace_id: workspaceId,
          product_id: productId,
          attribute_id: attributeId,
          value,
        };
      })
      .filter(Boolean);

    if (rows.length > 0) {
      const { error: insertError } = await client.database.from("product_attribute_values").insert(rows);
      if (insertError) return json({ error: insertError.message }, 400);
    }

    const { data, error: selectError } = await client.database
      .from("product_attribute_values")
      .select()
      .eq("workspace_id", workspaceId)
      .eq("product_id", productId);
    if (selectError) return json({ error: selectError.message }, 400);

    return json(data || []);
  }

  const tableKey = resource === "team" && segments[1] === "members" ? "team/members" : resource;
  const table = tableMap[tableKey];
  if (!table) {
    return json({ error: `Unsupported route: ${route}` }, 404);
  }

  const effectiveId = tableKey === "team/members" ? segments[2] : id;

  if (request.method === "GET" && !effectiveId) {
    return listFrom(table);
  }

  if (request.method === "GET" && effectiveId) {
    const { data, error } = await client.database
      .from(table)
      .select()
      .eq("workspace_id", workspaceId)
      .eq("id", effectiveId)
      .limit(1);
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (request.method === "POST") {
    const body = await parseBody();
    const payload = { ...body, workspace_id: workspaceId };
    const { data, error } = await client.database.from(table).insert([payload]).select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (request.method === "PATCH" && effectiveId) {
    const body = await parseBody();
    const { data, error } = await client.database
      .from(table)
      .update({ ...body })
      .eq("workspace_id", workspaceId)
      .eq("id", effectiveId)
      .select();
    if (error) return json({ error: error.message }, 400);
    return json((data || [])[0] || null);
  }

  if (request.method === "DELETE" && effectiveId) {
    const { error } = await client.database
      .from(table)
      .delete()
      .eq("workspace_id", workspaceId)
      .eq("id", effectiveId);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
};
