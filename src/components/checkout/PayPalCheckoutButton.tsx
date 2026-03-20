/**
 * PayPal Checkout button for subscription upgrades.
 * Per https://developer.paypal.com/studio/checkout/standard/integrate
 *
 * - With VITE_PAYPAL_CLIENT_ID + VITE_API_BASE_URL: uses real PayPal JS SDK + backend create/capture
 * - With VITE_PAYPAL_USE_MOCK=true or no client ID: uses demo flow (mock create + capture)
 */

import { useCallback, useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { createOrder, captureOrder } from "@/services/paypalApi";
import type { BillingInterval } from "@/types/billing";

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? "";
const useMock = import.meta.env.VITE_PAYPAL_USE_MOCK === "true" || !clientId;
const hasApiBase = Boolean((import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, ""));

export type PaymentStep =
  | "idle"
  | "creating_order"
  | "awaiting_approval"
  | "capturing"
  | "success"
  | "error";

export type PayPalCheckoutButtonProps = {
  amount: number;
  currency?: string;
  planCode: string;
  interval: BillingInterval;
  onSuccess: () => void;
  onError?: (err: Error) => void;
  onStepChange?: (step: PaymentStep) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Demo flow: simulates create → approve → capture with step updates.
 */
function DemoPayPalButton({
  amount,
  planCode,
  interval,
  onSuccess,
  onError,
  onStepChange,
  disabled,
  children,
  className,
}: PayPalCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<PaymentStep>("idle");

  const updateStep = useCallback(
    (s: PaymentStep) => {
      setStep(s);
      onStepChange?.(s);
    },
    [onStepChange]
  );

  const handleClick = useCallback(async () => {
    setLoading(true);
    updateStep("creating_order");
    try {
      if (hasApiBase) {
        const createRes = await createOrder({
          amount: amount.toFixed(2),
          currency_code: "USD",
          plan_code: planCode,
          interval,
        });
        updateStep("awaiting_approval");
        await new Promise((r) => setTimeout(r, 600));
        updateStep("capturing");
        await captureOrder(createRes.id);
      } else {
        await new Promise((r) => setTimeout(r, 400));
        updateStep("awaiting_approval");
        await new Promise((r) => setTimeout(r, 600));
        updateStep("capturing");
        await new Promise((r) => setTimeout(r, 400));
      }
      updateStep("success");
      onSuccess();
    } catch (err) {
      updateStep("error");
      onError?.(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [amount, planCode, interval, onSuccess, onError, updateStep]);

  const stepLabel =
    step === "creating_order"
      ? "Creating order…"
      : step === "awaiting_approval"
        ? "Awaiting approval…"
        : step === "capturing"
          ? "Completing payment…"
          : loading
            ? "Processing…"
            : children ?? "Pay with PayPal";

  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`min-w-[200px] ${className ?? ""}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {stepLabel}
        </>
      ) : (
        children ?? "Pay with PayPal"
      )}
    </Button>
  );
}

/**
 * Real PayPal flow: uses JS SDK with backend create/capture.
 */
function RealPayPalButtons({
  amount,
  planCode,
  interval,
  onSuccess,
  onError,
  onStepChange,
  disabled,
}: PayPalCheckoutButtonProps) {
  const createOrderHandler = useCallback(async () => {
    onStepChange?.("creating_order");
    const res = await createOrder({
      amount: amount.toFixed(2),
      currency_code: "USD",
      plan_code: planCode,
      interval,
    });
    onStepChange?.("awaiting_approval");
    return res.id;
  }, [amount, planCode, interval, onStepChange]);

  const onApproveHandler = useCallback(
    async (data: { orderID: string }) => {
      try {
        onStepChange?.("capturing");
        await captureOrder(data.orderID);
        onStepChange?.("success");
        onSuccess();
      } catch (err) {
        onStepChange?.("error");
        onError?.(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [onSuccess, onError, onStepChange]
  );

  const onErrorHandler = useCallback(
    (err: Record<string, unknown>) => {
      onStepChange?.("error");
      onError?.(new Error(String(err?.message ?? err)));
    },
    [onError, onStepChange]
  );

  if (disabled) return null;

  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "gold", shape: "rect" }}
      createOrder={createOrderHandler}
      onApprove={onApproveHandler}
      onError={onErrorHandler}
      disabled={disabled}
    />
  );
}

export function PayPalCheckoutButton(props: PayPalCheckoutButtonProps) {
  if (useMock) {
    return <DemoPayPalButton {...props} />;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId || "sb",
        "client-id": clientId || "sb",
        currency: "USD",
        intent: "capture",
        components: "buttons",
      }}
    >
      <RealPayPalButtons {...props} />
    </PayPalScriptProvider>
  );
}
