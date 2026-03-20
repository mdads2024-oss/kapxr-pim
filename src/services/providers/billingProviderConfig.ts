import { apiBillingProvider } from "@/services/providers/apiBillingProvider";
import type { BillingProvider } from "@/services/providers/billingProvider";
import { mockBillingProvider } from "@/services/providers/mockBillingProvider";

export type BillingDataSource = "mock" | "api";

const configuredSource = (import.meta.env.VITE_BILLING_DATA_SOURCE ?? "mock") as BillingDataSource;

export const resolveBillingProvider = (): BillingProvider => {
  if (configuredSource === "api") {
    return apiBillingProvider;
  }
  return mockBillingProvider;
};

export const getBillingDataSource = (): BillingDataSource => configuredSource;
