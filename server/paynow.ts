import { createRequire } from "module";
const require = createRequire(import.meta.url);
const Paynow = require("paynow");

const paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID!,
  process.env.PAYNOW_INTEGRATION_KEY!
);

paynow.resultUrl = `${process.env.APP_URL}/api/paynow/callback`;
paynow.returnUrl = `${process.env.APP_URL}/subscribe/return`;

export async function initiateSubscriptionPayment(
  email: string,
  phone: string,
  method: "ecocash" | "innbucks"
) {
  const payment = paynow.createPayment(`ZimService-Sub-${Date.now()}`, email);
  payment.add("ZimService Provider Subscription - 1 Month", 2);

  const response = method === "ecocash"
    ? await paynow.sendMobile(payment, phone, "ecocash")
    : await paynow.sendMobile(payment, phone, "innbucks");

  if (!response.success) {
    throw new Error(response.error || "Payment initiation failed");
  }

  return {
    pollUrl: response.pollUrl,
    redirectUrl: response.redirectUrl || null,
    instructions: response.instructions || null,
  };
}

export async function pollPaymentStatus(pollUrl: string) {
  const status = await paynow.pollTransaction(pollUrl);
  return {
    paid: status.paid,
    status: status.status,
  };
}
