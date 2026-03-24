import { apiClient } from "@/services/api/client";
import type { BillingProvider } from "@/services/providers/billingProvider";
import type {
  BillingInvoice,
  BillingPlan,
  BillingUsage,
  StartCheckoutInput,
  WorkspaceSubscription,
} from "@/types/billing";

type ApiBillingPlan = {
  id: string;
  code: "starter" | "growth" | "pro";
  name: string;
  description: string;
  monthly_price: number | string;
  yearly_price: number | string;
  storage_limit_gb: number;
  seats_included: number;
  connectors_included: number;
  is_popular: boolean;
  features: string[] | unknown;
};

type ApiWorkspaceSubscription = {
  organization_name: string;
  plan_code: "starter" | "growth" | "pro";
  status: "trialing" | "active" | "past_due" | "canceled";
  billing_interval: "monthly" | "yearly";
  provider: "paypal";
  renewal_date: string;
  trial_ends_at?: string | null;
};

export const apiBillingProvider: BillingProvider = {
  async getPlans() {
    const rows = await apiClient.get<ApiBillingPlan[]>("/billing/plans");
    return rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      monthlyPrice: Number(row.monthly_price),
      yearlyPrice: Number(row.yearly_price),
      storageLimitGb: row.storage_limit_gb,
      seatsIncluded: row.seats_included,
      connectorsIncluded: row.connectors_included,
      isPopular: row.is_popular,
      features: Array.isArray(row.features) ? (row.features as string[]) : [],
    }));
  },

  async getWorkspaceSubscription() {
    const row = await apiClient.get<ApiWorkspaceSubscription | null>("/billing/subscription");
    if (!row) {
      return {
        organizationName: "Kapxr Workspace",
        planCode: "starter",
        status: "trialing",
        billingInterval: "monthly",
        provider: "paypal",
        renewalDate: new Date().toISOString(),
      };
    }
    return {
      organizationName: row.organization_name,
      planCode: row.plan_code,
      status: row.status,
      billingInterval: row.billing_interval,
      provider: row.provider,
      renewalDate: row.renewal_date,
      trialEndsAt: row.trial_ends_at ?? undefined,
    };
  },

  async startCheckout(input: StartCheckoutInput) {
    return apiClient.post<WorkspaceSubscription>("/billing/checkout/session", input);
  },

  async cancelSubscription() {
    return apiClient.post<WorkspaceSubscription>("/billing/subscription/cancel", {});
  },

  async resumeSubscription() {
    return apiClient.post<WorkspaceSubscription>("/billing/subscription/resume", {});
  },

  async changePlan(input: StartCheckoutInput) {
    return apiClient.post<WorkspaceSubscription>("/billing/subscription/change-plan", input);
  },
  async getUsage() {
    return apiClient.get<BillingUsage>("/billing/usage");
  },
  async getInvoices() {
    return apiClient.get<BillingInvoice[]>("/billing/invoices");
  },
};
