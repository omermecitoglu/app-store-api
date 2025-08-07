import { z } from "zod";

export const NotificationDTO = z.object({
  eventName: z.enum([
    "TEST",
    "SUBSCRIBED:INITIAL_BUY",
    "SUBSCRIBED:RESUBSCRIBE",
    "DID_RENEW",
    "DID_RENEW:BILLING_RECOVERY",
    "DID_FAIL_TO_RENEW",
    "DID_CHANGE_RENEWAL_PREF",
    "DID_CHANGE_RENEWAL_STATUS",
    "EXPIRED",
  ]).describe("The name of the event triggered by the notification."),
  transactionPayload: z.string().describe("The signed transaction information from the notification."),
}).describe("Notification details from the App Store");
