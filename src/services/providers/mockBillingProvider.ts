import type { BillingProvider } from "@/services/providers/billingProvider";
import type {
  BillingInterval,
  BillingPlan,
  StartCheckoutInput,
  WorkspaceSubscription,
} from "@/types/billing";

const PLANS: BillingPlan[] = [
  {
    id: 1,
    code: "starter",
    name: "Starter",
    description: "Best for growing catalogs getting started with governed product operations.",
    monthlyPrice: 49,
    yearlyPrice: 39,
    storageLimitGb: 100,
    seatsIncluded: 5,
    connectorsIncluded: 2,
    features: ["Core PIM", "Basic DAM", "CSV import/export", "Email support"],
  },
  {
    id: 2,
    code: "growth",
    name: "Growth",
    description: "Designed for teams scaling across channels with richer workflows and automation.",
    monthlyPrice: 129,
    yearlyPrice: 99,
    storageLimitGb: 500,
    seatsIncluded: 20,
    connectorsIncluded: 6,
    isPopular: true,
    features: ["Advanced PIM + DAM", "Workflow approvals", "Analytics", "Priority support"],
  },
  {
    id: 3,
    code: "pro",
    name: "Pro",
    description: "Enterprise-ready controls for high-volume multi-team product operations.",
    monthlyPrice: 299,
    yearlyPrice: 239,
    storageLimitGb: 2000,
    seatsIncluded: 100,
    connectorsIncluded: 20,
    features: ["Custom roles", "Audit logs", "API access", "Dedicated onboarding"],
  },
];

const STORAGE_KEY = "kapxr:workspace-subscription";

const delay = async (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

const nextRenewal = (interval: BillingInterval) => {
  const now = new Date();
  const next = new Date(now);
  if (interval === "yearly") {
    next.setFullYear(next.getFullYear() + 1);
  } else {
    next.setMonth(next.getMonth() + 1);
  }
  return next.toISOString();
};

const defaultSubscription: WorkspaceSubscription = {
  organizationName: "Kapxr Workspace",
  planCode: "starter",
  status: "trialing",
  billingInterval: "monthly",
  provider: "paypal",
  renewalDate: nextRenewal("monthly"),
  trialEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
};

const readSubscription = (): WorkspaceSubscription => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultSubscription;
  try {
    const parsed = JSON.parse(raw) as WorkspaceSubscription;
    return parsed;
  } catch {
    return defaultSubscription;
  }
};

const writeSubscription = (subscription: WorkspaceSubscription) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subscription));
};

export const mockBillingProvider: BillingProvider = {
  async getPlans() {
    await delay();
    return PLANS;
  },

  async getWorkspaceSubscription() {
    await delay();
    return readSubscription();
  },

  async startCheckout(input: StartCheckoutInput) {
    await delay(500);
    const next: WorkspaceSubscription = {
      ...readSubscription(),
      planCode: input.planCode,
      billingInterval: input.interval,
      status: "active",
      provider: "paypal",
      renewalDate: nextRenewal(input.interval),
      trialEndsAt: undefined,
    };
    writeSubscription(next);
    return next;
  },

  async cancelSubscription() {
    await delay();
    const next: WorkspaceSubscription = {
      ...readSubscription(),
      status: "canceled",
    };
    writeSubscription(next);
    return next;
  },

  async resumeSubscription() {
    await delay();
    const current = readSubscription();
    const next: WorkspaceSubscription = {
      ...current,
      status: "active",
      renewalDate: nextRenewal(current.billingInterval),
    };
    writeSubscription(next);
    return next;
  },

  async changePlan(input: StartCheckoutInput) {
    await delay(450);
    const next: WorkspaceSubscription = {
      ...readSubscription(),
      planCode: input.planCode,
      billingInterval: input.interval,
      status: "active",
      renewalDate: nextRenewal(input.interval),
    };
    writeSubscription(next);
    return next;
  },
};
