import { apiPimProvider } from "@/services/providers/apiPimProvider";
import { mockPimProvider } from "@/services/providers/mockPimProvider";
import type { PIMProvider } from "@/services/providers/pimProvider";

export type PIMDataSource = "mock" | "api";

const configuredSource = (import.meta.env.VITE_PIM_DATA_SOURCE ?? "mock") as PIMDataSource;

export const resolvePimProvider = (): PIMProvider => {
  if (configuredSource === "api") {
    return apiPimProvider;
  }
  return mockPimProvider;
};

export const getPimDataSource = (): PIMDataSource => configuredSource;
