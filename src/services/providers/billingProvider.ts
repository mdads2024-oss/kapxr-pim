import type {
  BillingInvoice,
  BillingPlan,
  BillingUsage,
  StartCheckoutInput,
  WorkspaceSubscription,
} from "@/types/billing";

export interface BillingProvider {
  getPlans(): Promise<BillingPlan[]>;
  getWorkspaceSubscription(): Promise<WorkspaceSubscription>;
  startCheckout(input: StartCheckoutInput): Promise<WorkspaceSubscription>;
  cancelSubscription(): Promise<WorkspaceSubscription>;
  resumeSubscription(): Promise<WorkspaceSubscription>;
  changePlan(input: StartCheckoutInput): Promise<WorkspaceSubscription>;
  getUsage(): Promise<BillingUsage>;
  getInvoices(): Promise<BillingInvoice[]>;
}
