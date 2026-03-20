import type { BillingInterval, BillingPlan } from "@/types/billing";

const SELECTED_PLAN_KEY = "kapxr:selected-plan";

export type SelectedPlan = {
  planCode: BillingPlan["code"];
  interval: BillingInterval;
};

export function getSelectedPlan(): SelectedPlan | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SELECTED_PLAN_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SelectedPlan;
    if (
      parsed &&
      (parsed.planCode === "starter" || parsed.planCode === "growth" || parsed.planCode === "pro") &&
      (parsed.interval === "monthly" || parsed.interval === "yearly")
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function setSelectedPlan(plan: SelectedPlan) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SELECTED_PLAN_KEY, JSON.stringify(plan));
}

export function clearSelectedPlan() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SELECTED_PLAN_KEY);
}
