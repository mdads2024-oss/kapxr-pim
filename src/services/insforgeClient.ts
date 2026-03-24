import { createClient } from "@insforge/sdk";

const requireInsforgeBaseUrl = (): string => {
  const value = import.meta.env.VITE_INSFORGE_BASE_URL as string | undefined;
  if (!value) throw new Error("VITE_INSFORGE_BASE_URL is required");
  return value.replace(/\/$/, "");
};

const requireInsforgeAnonKey = (): string => {
  const value = import.meta.env.VITE_INSFORGE_ANON_KEY as string | undefined;
  if (!value) throw new Error("VITE_INSFORGE_ANON_KEY is required");
  return value;
};

export const insforgeClient = createClient({
  baseUrl: requireInsforgeBaseUrl(),
  anonKey: requireInsforgeAnonKey(),
});

