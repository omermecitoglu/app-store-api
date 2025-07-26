import { z } from "zod";

export const SubscriptionDTO = z.object({
  id: z.string(),
  variantName: z.string(),
  billingCycle: z.number(),
  billingAnchor: z.number(),
  status: z.enum(["expired", "active", "cancelled", "unknown"]),
  endsAt: z.string().nullable(),
  renewsAt: z.string(),
});
