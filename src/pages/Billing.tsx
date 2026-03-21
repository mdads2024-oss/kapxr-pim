import { useAppPageTitle } from "@/hooks/useAppPageTitle";
import { AppLoader } from "@/components/shared/AppLoader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download } from "lucide-react";
import { PayPalCheckoutSection } from "@/components/checkout/PayPalCheckoutSection";
import { useCallback, useState } from "react";
import {
  useBillingPlansQuery,
  useBillingSubscriptionQuery,
  useChangePlanMutation,
  useStartCheckoutMutation,
} from "@/hooks/useBillingQueries";
import { clearSelectedPlan, getSelectedPlan } from "@/lib/billingSelection";
import { useToast } from "@/hooks/use-toast";
import { notifyError, notifyInfo, notifySuccess } from "@/lib/notify";

export default function BillingPage() {
  useAppPageTitle("Billing");
  const { toast } = useToast();
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentName, setPaymentName] = useState("Manish Yadav");
  const [paymentEmail, setPaymentEmail] = useState("manish@kapxr.ai");
  const [paymentCompany, setPaymentCompany] = useState("Kapxr Technologies");
  const { data: plans = [], isLoading: plansLoading } = useBillingPlansQuery();
  const { data: subscription, isLoading: subscriptionLoading } = useBillingSubscriptionQuery();
  const isLoading = plansLoading || subscriptionLoading;
  const startCheckoutMutation = useStartCheckoutMutation();
  const changePlanMutation = useChangePlanMutation();

  const selectedPlan = getSelectedPlan();
  const activePlan = plans.find((plan) => plan.code === (subscription?.planCode ?? "starter"));
  const activePlanPrice = activePlan
    ? subscription?.billingInterval === "yearly"
      ? activePlan.yearlyPrice
      : activePlan.monthlyPrice
    : 0;
  const proPlan = plans.find((plan) => plan.code === "pro");
  const upgradePlan = activePlan?.code === "pro" ? null : proPlan ?? null;
  const upgradePlanName = activePlan?.code === "pro" ? "Pro+" : upgradePlan?.name ?? "Pro";
  const upgradePlanPrice = activePlan?.code === "pro"
    ? Math.max(activePlanPrice + 60, 359)
    : upgradePlan
      ? subscription?.billingInterval === "yearly"
        ? upgradePlan.yearlyPrice
        : upgradePlan.monthlyPrice
      : 0;
  const checkoutPlanCode = upgradePlan?.code ?? activePlan?.code ?? "pro";
  if (isLoading) {
    return <AppLoader message="Loading billing…" />;
  }

  const usage = {
    storageUsedGb: 312,
    seatsUsed: 18,
    connectorsUsed: 5,
  };

  const handleActivateSelectedPlan = async () => {
    if (!selectedPlan) return;
    await startCheckoutMutation.mutateAsync({
      planCode: selectedPlan.planCode,
      interval: selectedPlan.interval,
    });
    clearSelectedPlan();
    notifySuccess(toast, "Subscription activated", "PayPal recurring mock checkout completed.");
  };

  const handleChangePlan = async (planCode: "starter" | "growth" | "pro") => {
    if (!subscription) return;
    await changePlanMutation.mutateAsync({
      planCode,
      interval: subscription.billingInterval,
    });
    notifySuccess(toast, "Plan updated", `Workspace moved to ${planCode} plan.`);
  };

  const handlePayPalSuccess = useCallback(() => {
    if (upgradePlan) {
      changePlanMutation.mutate(
        {
          planCode: upgradePlan.code,
          interval: subscription?.billingInterval ?? "monthly",
        },
        {
          onSuccess: () => {
            notifySuccess(toast, "Payment successful", `Subscription upgraded to ${upgradePlan.name}.`);
          },
        }
      );
      return;
    }

    notifySuccess(
      toast,
      "Payment authorization received",
      "Pro+ onboarding request submitted. Our billing team will contact you to finalize enterprise activation."
    );
    // Modal closes when user clicks Done in checkout section
  }, [upgradePlan, subscription?.billingInterval, changePlanMutation, toast]);

  const handlePayPalError = useCallback(
    (err: Error) => {
      notifyError(toast, "Payment failed", err.message);
    },
    [toast]
  );

  return (
    <>
      <div className="max-w-6xl space-y-4">
        <Card className="border-border/70 bg-muted/20">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-sm">Plan & Usage</CardTitle>
            <CardDescription>Manage current plan, payment method, invoices, and upgrades.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-gradient-to-br from-background to-muted/30 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Current plan</p>
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-2xl font-semibold capitalize">{activePlan?.code ?? "starter"}</p>
                  <p className="text-lg font-medium text-muted-foreground">
                    ${activePlanPrice}
                    <span className="text-sm">/mo</span>
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Renews on {subscription ? new Date(subscription.renewalDate).toLocaleDateString() : "--"} (
                  {subscription?.status ?? "trialing"})
                </p>
                <Button size="sm" variant="outline" className="mt-2 h-8" onClick={() => setManageModalOpen(true)}>
                  Manage Subscription
                </Button>
              </div>

              <div className="rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Upgrade available</p>
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-2xl font-semibold">{upgradePlanName}</p>
                  <p className="text-lg font-medium text-muted-foreground">
                    ${upgradePlanPrice}
                    <span className="text-sm">/mo</span>
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Unlock more usage on Agent and advanced workspace capabilities.
                </p>
                {selectedPlan ? (
                  <Button
                    size="sm"
                    className="mt-2 h-8"
                    onClick={handleActivateSelectedPlan}
                    disabled={startCheckoutMutation.isPending}
                  >
                    {startCheckoutMutation.isPending ? "Processing..." : "Activate selected plan"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="mt-2 h-8"
                    onClick={() => setPaymentModalOpen(true)}
                    disabled={changePlanMutation.isPending}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Payment Method</p>
                  <Badge variant="secondary" className="text-[10px]">PayPal</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-md border border-border/60 bg-card px-2.5 py-2">
                  <div className="inline-flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-primary" />
                    <div>
                      <p className="text-xs font-medium">PayPal Billing Agreement</p>
                      <p className="text-[11px] text-muted-foreground">{paymentEmail}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7" onClick={() => setPaymentModalOpen(true)}>
                    Update
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Usage This Cycle</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Storage</span>
                      <span>{usage.storageUsedGb}GB / {activePlan?.storageLimitGb ?? 0}GB</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${Math.min((usage.storageUsedGb / Math.max(activePlan?.storageLimitGb ?? 1, 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-md border border-border/60 bg-card p-2">
                      <p className="text-muted-foreground">Seats</p>
                      <p className="font-semibold">{usage.seatsUsed} / {activePlan?.seatsIncluded ?? 0}</p>
                    </div>
                    <div className="rounded-md border border-border/60 bg-card p-2">
                      <p className="text-muted-foreground">Connectors</p>
                      <p className="font-semibold">{usage.connectorsUsed} / {activePlan?.connectorsIncluded ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/70 bg-background/70 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Recent Transactions</p>
              <div className="mt-2 space-y-2">
                {[
                  { id: "INV-3007", amount: "$129.00", status: "Paid", date: "Mar 01, 2026" },
                  { id: "INV-2974", amount: "$129.00", status: "Paid", date: "Feb 01, 2026" },
                ].map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-md border border-border/60 bg-card px-2.5 py-2">
                    <div>
                      <p className="text-xs font-medium">{invoice.id}</p>
                      <p className="text-[11px] text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]">
                        <Download className="mr-1 h-3 w-3" />
                        PDF
                      </Button>
                      <p className="text-xs font-semibold">{invoice.amount}</p>
                      <p className="text-[11px] text-success">{invoice.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={manageModalOpen} onOpenChange={setManageModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Manage Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <p className="text-xs font-medium capitalize">
                {activePlan?.code ?? "starter"} • ${activePlanPrice}/mo
              </p>
              <p className="text-[11px] text-muted-foreground">
                Next renewal on {subscription ? new Date(subscription.renewalDate).toLocaleDateString() : "--"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => setPaymentModalOpen(true)}>
                Change payment method
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setManageModalOpen(false);
                  setPaymentModalOpen(true);
                }}
              >
                Upgrade plan
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => notifyInfo(toast, "Cancellation request", "Your subscription is marked for cancel at period end (mock).")}
            >
              Cancel at period end
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Pay with PayPal</DialogTitle>
          </DialogHeader>
          <PayPalCheckoutSection
            planName={upgradePlanName}
            planCode={checkoutPlanCode}
            amount={upgradePlanPrice}
            interval={subscription?.billingInterval ?? "monthly"}
            onSuccess={handlePayPalSuccess}
            onError={handlePayPalError}
            onCancel={() => setPaymentModalOpen(false)}
            billingInfo={{
              name: paymentName,
              company: paymentCompany,
              email: paymentEmail,
            }}
            onBillingInfoChange={(info) => {
              setPaymentName(info.name);
              setPaymentCompany(info.company);
              setPaymentEmail(info.email);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
