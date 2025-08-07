import { z } from "zod";

export const SubscriptionDTO = z.object({
  id: z.string().describe("ID of the subscription"),
  variantName: z.string().describe("Name of the subscription variant"),
  billingCycle: z.number().describe("Billing cycle of the subscription, 1 for monthly, 2 for yearly"),
  billingAnchor: z.number().describe("Billing anchor of the subscription, day of the month when the subscription renews"),
  status: z.enum(["expired", "active", "cancelled", "unknown"]).describe("Status of the subscription"),
  endsAt: z.string().nullable().describe("Date when the subscription ends, null if the subscription is active"),
  renewsAt: z.string().describe("Date when the subscription renews"),
}).describe("Subscription details");
