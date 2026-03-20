import { setBillingProvider } from "@/services/billingService";
import {
  getBillingDataSource,
  resolveBillingProvider,
} from "@/services/providers/billingProviderConfig";

export const initBillingProvider = () => {
  const provider = resolveBillingProvider();
  setBillingProvider(provider);

  if (import.meta.env.DEV) {
    console.info(`[Billing] data source: ${getBillingDataSource()}`);
  }
};
