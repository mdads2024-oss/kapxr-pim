/**
 * Full standard PayPal payment flow UI.
 * Steps: 1) Review order → 2) Pay with PayPal → 3) Complete
 */

import { useState, useCallback } from "react";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PayPalCheckoutButton,
  type PaymentStep,
} from "@/components/checkout/PayPalCheckoutButton";
import type { BillingInterval } from "@/types/billing";

export type PayPalCheckoutSectionProps = {
  planName: string;
  planCode: string;
  amount: number;
  interval: BillingInterval;
  onSuccess: () => void;
  onError?: (err: Error) => void;
  onCancel: () => void;
  /** Pre-filled billing info (name, company, email) */
  billingInfo?: { name: string; company: string; email: string };
  onBillingInfoChange?: (info: { name: string; company: string; email: string }) => void;
};

const steps: { id: number; label: string; key: "review" | "pay" | "complete" }[] = [
  { id: 1, label: "Review", key: "review" },
  { id: 2, label: "Pay", key: "pay" },
  { id: 3, label: "Complete", key: "complete" },
];

export function PayPalCheckoutSection({
  planName,
  planCode,
  amount,
  interval,
  onSuccess,
  onError,
  onCancel,
  billingInfo = { name: "", company: "", email: "" },
  onBillingInfoChange,
}: PayPalCheckoutSectionProps) {
  const [currentStep, setCurrentStep] = useState<"review" | "pay" | "complete">("review");
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("idle");

  const handleStepChange = useCallback((step: PaymentStep) => {
    setPaymentStep(step);
    if (step === "success") {
      setCurrentStep("complete");
    }
  }, []);

  const handleSuccess = useCallback(() => {
    setCurrentStep("complete");
    onSuccess();
  }, [onSuccess]);

  const getStepStatus = (key: "review" | "pay" | "complete") => {
    const idx = steps.findIndex((s) => s.key === key);
    const currentIdx = steps.findIndex((s) => s.key === currentStep);
    if (idx < currentIdx) return "done";
    if (idx === currentIdx) return "active";
    return "pending";
  };

  return (
    <div className="space-y-5">
      {/* Step progress */}
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, i) => {
          const status = getStepStatus(s.key);
          return (
            <div key={s.key} className="flex flex-1 items-center">
              <div
                className={`flex flex-col items-center gap-1 ${status === "done" ? "text-primary" : status === "active" ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm ${
                    status === "done"
                      ? "border-primary bg-primary text-primary-foreground"
                      : status === "active"
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-muted/30"
                  }`}
                >
                  {status === "done" ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                </div>
                <span className="text-[11px] font-medium">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded ${status === "done" ? "bg-primary" : "bg-muted"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 & 2: Review + Pay */}
      {(currentStep === "review" || currentStep === "pay") && (
        <>
          {/* Order summary */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Order Summary
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-lg font-semibold">{planName}</p>
              <p className="text-xl font-semibold">
                ${amount}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  /{interval === "yearly" ? "year" : "month"}
                </span>
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Recurring subscription. Billed via PayPal.
            </p>
          </div>

          {/* Billing info */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Billing information
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Full name</Label>
                <Input
                  className="h-9 text-sm"
                  value={billingInfo.name}
                  onChange={(e) =>
                    onBillingInfoChange?.({
                      ...billingInfo,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Company</Label>
                <Input
                  className="h-9 text-sm"
                  value={billingInfo.company}
                  onChange={(e) =>
                    onBillingInfoChange?.({
                      ...billingInfo,
                      company: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">Billing email</Label>
                <Input
                  type="email"
                  className="h-9 text-sm"
                  value={billingInfo.email}
                  onChange={(e) =>
                    onBillingInfoChange?.({
                      ...billingInfo,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* PayPal secure note */}
          <div className="rounded-md border border-border/70 bg-muted/20 p-3">
            <p className="inline-flex items-center gap-2 text-xs font-medium">
              <ShieldCheck className="h-4 w-4 text-success" />
              Secured by PayPal. You'll complete payment in the PayPal window.
            </p>
          </div>

          {/* Payment step indicator (when processing) */}
          {(paymentStep === "creating_order" ||
            paymentStep === "awaiting_approval" ||
            paymentStep === "capturing") && (
            <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>
                {paymentStep === "creating_order" && "Creating order…"}
                {paymentStep === "awaiting_approval" && "Awaiting your approval…"}
                {paymentStep === "capturing" && "Completing payment…"}
              </span>
            </div>
          )}

          {/* PayPal button */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <div className="flex min-h-[42px] items-center">
              <PayPalCheckoutButton
                amount={amount}
                planCode={planCode}
                interval={interval}
                onSuccess={handleSuccess}
                onError={onError}
                onStepChange={handleStepChange}
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pay with PayPal
                </span>
              </PayPalCheckoutButton>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Complete */}
      {currentStep === "complete" && (
        <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
          <p className="mt-2 font-semibold">Payment successful</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your subscription has been upgraded. You can close this window.
          </p>
          <Button size="sm" className="mt-4" onClick={onCancel}>
            Done
          </Button>
        </div>
      )}
    </div>
  );
}
