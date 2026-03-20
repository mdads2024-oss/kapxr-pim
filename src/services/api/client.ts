const requireApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is required when VITE_PIM_DATA_SOURCE=api");
  }
  return baseUrl.replace(/\/$/, "");
};

const buildUrl = (path: string): string => `${requireApiBaseUrl()}${path}`;

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await fetch(buildUrl(path));
    if (!response.ok) {
      throw new Error(`GET ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`POST ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`PATCH ${path} failed: ${response.status}`);
    }
    return (await response.json()) as T;
  },

  async delete(path: string): Promise<void> {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`DELETE ${path} failed: ${response.status}`);
    }
  },
};
