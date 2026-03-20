import type { BillingProvider } from "@/services/providers/billingProvider";
import { mockBillingProvider } from "@/services/providers/mockBillingProvider";
import type { StartCheckoutInput } from "@/types/billing";

let activeProvider: BillingProvider = mockBillingProvider;

export const setBillingProvider = (provider: BillingProvider) => {
  activeProvider = provider;
};

export const billingService = {
  async getPlans() {
    return activeProvider.getPlans();
  },
  async getWorkspaceSubscription() {
    return activeProvider.getWorkspaceSubscription();
  },
  async startCheckout(input: StartCheckoutInput) {
    return activeProvider.startCheckout(input);
  },
  async cancelSubscription() {
    return activeProvider.cancelSubscription();
  },
  async resumeSubscription() {
    return activeProvider.resumeSubscription();
  },
  async changePlan(input: StartCheckoutInput) {
    return activeProvider.changePlan(input);
  },
};
