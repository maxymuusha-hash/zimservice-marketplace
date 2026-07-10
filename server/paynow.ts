import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PaynowModule = require("paynow");
const Paynow = PaynowModule.Paynow || PaynowModule.default || PaynowModule;

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

  // Log the raw response so we can see exactly what Paynow returns (visible in Render logs)
  console.log("Paynow sendMobile response (" + method + "):", JSON.stringify(response, null, 2));

  if (!response.success) {
    throw new Error(response.error || "Payment initiation failed");
  }

  // InnBucks payments return an authorization code the customer uses to
  // complete payment in the InnBucks app. Field name varies by SDK version,
  // so check all known locations.
  const authCode =
    response.innbucks_info?.[0]?.authorizationcode ||
    response.innbucksInfo?.[0]?.authorizationcode ||
    response.authorizationcode ||
    response.authorizationCode ||
    null;

  const deepLink =
    response.innbucks_info?.[0]?.deep_link_url ||
    response.innbucksInfo?.[0]?.deep_link_url ||
    null;

  return {
    pollUrl: response.pollUrl,
    redirectUrl: response.redirectUrl || null,
    instructions: response.instructions || null,
    authCode,
    deepLink,
    method,
  };
}

export async function pollPaymentStatus(pollUrl: string) {
  const status = await paynow.pollTransaction(pollUrl);
  return {
    paid: status.paid,
    status: status.status,
  };
}
