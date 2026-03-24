import { insforgeClient } from "@/services/insforgeClient";
import { getAuthSession } from "@/lib/auth";

const requireApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is required when VITE_PIM_DATA_SOURCE=api");
  }
  return baseUrl.replace(/\/$/, "");
};

const useInsforgeFunctionMode = (): boolean => import.meta.env.VITE_INSFORGE_FUNCTION_MODE === "true";
const functionSlug = import.meta.env.VITE_INSFORGE_FUNCTION_SLUG || "kapxr-api";

const buildUrl = (path: string): string => {
  const base = requireApiBaseUrl();
  if (!useInsforgeFunctionMode()) {
    return `${base}${path}`;
  }
  const query = new URLSearchParams({ path: path.replace(/^\//, "") });
  return `${base}?${query.toString()}`;
};

const resolveInsforgeBaseUrl = (): string => {
  const explicitBase = import.meta.env.VITE_INSFORGE_BASE_URL as string | undefined;
  if (explicitBase) return explicitBase.replace(/\/$/, "");

  const apiBaseUrl = requireApiBaseUrl();
  const marker = "/api/functions/";
  const idx = apiBaseUrl.indexOf(marker);
  if (idx !== -1) return apiBaseUrl.slice(0, idx);
  return apiBaseUrl.replace(/\/$/, "");
};

const getInsforgeClient = () => {
  const explicitBase = import.meta.env.VITE_INSFORGE_BASE_URL as string | undefined;
  if (!explicitBase) {
    const fallbackBase = resolveInsforgeBaseUrl();
    if (fallbackBase) return insforgeClient;
  }
  return insforgeClient;
};

const buildHeaders = (): HeadersInit => {
  const headers: HeadersInit = {};
  const workspaceSlug = import.meta.env.VITE_WORKSPACE_SLUG;
  const bearerToken = import.meta.env.VITE_INSFORGE_BEARER_TOKEN;
  if (workspaceSlug) headers["X-Workspace-Slug"] = workspaceSlug;
  if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`;
  const session = getAuthSession();
  if (session?.email) headers["X-User-Email"] = session.email;
  return headers;
};

const invokeThroughInsforge = async <T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown
): Promise<T> => {
  const client = getInsforgeClient();
  const route = path.replace(/^\//, "");
  const { data, error } = await client.functions.invoke(functionSlug, {
    method,
    body: body ?? undefined,
    headers: {
      "X-Workspace-Slug": (import.meta.env.VITE_WORKSPACE_SLUG as string | undefined) || "default",
      "X-Route-Path": route,
      ...(getAuthSession()?.email ? { "X-User-Email": getAuthSession()!.email } : {}),
    },
  });

  if (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    throw new Error(`${method} ${path} failed${statusCode ? `: ${statusCode}` : ""} - ${error.message}`);
  }
  return data as T;
};

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    if (useInsforgeFunctionMode()) {
      return invokeThroughInsforge<T>("GET", path);
    }
    const response = await fetch(buildUrl(path), {
      headers: buildHeaders(),
    });
    if (!response.ok) {
      throw new Error(`GET ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    if (useInsforgeFunctionMode()) {
      return invokeThroughInsforge<T>("POST", path, body);
    }
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...buildHeaders() },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`POST ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    if (useInsforgeFunctionMode()) {
      return invokeThroughInsforge<T>("PATCH", path, body);
    }
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...buildHeaders() },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`PATCH ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  },

  async delete(path: string): Promise<void> {
    if (useInsforgeFunctionMode()) {
      await invokeThroughInsforge<unknown>("DELETE", path);
      return;
    }
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: buildHeaders(),
    });
    if (!response.ok) {
      throw new Error(`DELETE ${path} failed: ${response.status}`);
    }
  },
};
