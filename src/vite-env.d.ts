/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PIM_DATA_SOURCE?: "mock" | "api";
  readonly VITE_BILLING_DATA_SOURCE?: "mock" | "api";
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PAYPAL_CLIENT_ID?: string;
  readonly VITE_PAYPAL_USE_MOCK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
