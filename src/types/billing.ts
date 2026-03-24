export type BillingInterval = "monthly" | "yearly";

export type BillingPlan = {
  id: string;
  code: "starter" | "growth" | "pro";
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  storageLimitGb: number;
  seatsIncluded: number;
  connectorsIncluded: number;
  isPopular?: boolean;
  features: string[];
};

export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export type PaymentProvider = "paypal";

export type WorkspaceSubscription = {
  organizationName: string;
  planCode: BillingPlan["code"];
  status: SubscriptionStatus;
  billingInterval: BillingInterval;
  provider: PaymentProvider;
  renewalDate: string;
  trialEndsAt?: string;
};

export type StartCheckoutInput = {
  planCode: BillingPlan["code"];
  interval: BillingInterval;
};

export type BillingUsage = {
  storageUsedGb: number;
  seatsUsed: number;
  connectorsUsed: number;
};

export type BillingInvoice = {
  id: string;
  amount: string;
  status: string;
  date: string;
};
