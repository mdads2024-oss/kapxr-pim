/**
 * PayPal Checkout API client.
 * Calls backend for create order and capture per:
 * https://developer.paypal.com/studio/checkout/standard/integrate
 */

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL ?? "";
  return url.replace(/\/$/, "");
};

export type CreateOrderInput = {
  amount: string;
  currency_code?: string;
  plan_code?: string;
  interval?: string;
};

export type CreateOrderResponse = {
  id: string;
  status: string;
  links?: { rel: string; href: string; method: string }[];
};

export type CaptureOrderResponse = {
  id: string;
  status: string;
  purchase_units?: {
    payments?: {
      captures?: { id: string; status: string; amount?: { currency_code: string; value: string } }[];
    };
  }[];
  payer?: {
    name?: { given_name?: string; surname?: string };
    email_address?: string;
    payer_id?: string;
  };
};

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResponse> {
  const base = getBaseUrl();
  if (!base) throw new Error("VITE_API_BASE_URL is required for PayPal checkout");

  const path = base.endsWith("/api") ? "/paypal/orders" : "/api/paypal/orders";
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: input.amount,
      currency_code: input.currency_code ?? "USD",
      plan_code: input.plan_code ?? "starter",
      interval: input.interval ?? "monthly",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create order failed: ${res.status} ${err}`);
  }
  return res.json() as Promise<CreateOrderResponse>;
}

export async function captureOrder(orderId: string): Promise<CaptureOrderResponse> {
  const base = getBaseUrl();
  if (!base) throw new Error("VITE_API_BASE_URL is required for PayPal checkout");

  const path = base.endsWith("/api") ? "/paypal/orders" : "/api/paypal/orders";
  const res = await fetch(`${base}${path}/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Capture order failed: ${res.status} ${err}`);
  }
  return res.json() as Promise<CaptureOrderResponse>;
}
