import { setPimProvider } from "@/services/pimService";
import { getPimDataSource, resolvePimProvider } from "@/services/providers/providerConfig";

export const initPimProvider = () => {
  const provider = resolvePimProvider();
  setPimProvider(provider);

  if (import.meta.env.DEV) {
    console.info(`[PIM] data source: ${getPimDataSource()}`);
  }
};
