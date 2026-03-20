import { apiClient } from "@/services/api/client";
import type { BillingProvider } from "@/services/providers/billingProvider";
import type { BillingPlan, StartCheckoutInput, WorkspaceSubscription } from "@/types/billing";

export const apiBillingProvider: BillingProvider = {
  async getPlans() {
    return apiClient.get<BillingPlan[]>("/billing/plans");
  },

  async getWorkspaceSubscription() {
    return apiClient.get<WorkspaceSubscription>("/billing/subscription");
  },

  async startCheckout(input: StartCheckoutInput) {
    return apiClient.post<WorkspaceSubscription>("/billing/checkout/session", input);
  },

  async cancelSubscription() {
    return apiClient.post<WorkspaceSubscription>("/billing/subscription/cancel");
  },

  async resumeSubscription() {
    return apiClient.post<WorkspaceSubscription>("/billing/subscription/resume");
  },

  async changePlan(input: StartCheckoutInput) {
    return apiClient.post<WorkspaceSubscription>("/billing/subscription/change-plan", input);
  },
};
