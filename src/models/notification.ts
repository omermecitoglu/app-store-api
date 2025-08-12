import { z } from "zod";

export const NotificationDTO = z.object({
  eventName: z.enum([
    "TEST",
    "SUBSCRIBED:INITIAL_BUY",
    "SUBSCRIBED:RESUBSCRIBE",
    "DID_RENEW",
    "DID_RENEW:BILLING_RECOVERY",
    "DID_FAIL_TO_RENEW",
    "DID_FAIL_TO_RENEW:GRACE_PERIOD",
    "DID_CHANGE_RENEWAL_PREF",
    "DID_CHANGE_RENEWAL_PREF:UPGRADE",
    "DID_CHANGE_RENEWAL_PREF:DOWNGRADE",
    "DID_CHANGE_RENEWAL_STATUS",
    "EXPIRED:VOLUNTARY",
    "EXPIRED:BILLING_RETRY",
    "EXPIRED:PRODUCT_NOT_FOR_SALE",
  ]).describe("The name of the event triggered by the notification."),
  transactionPayload: z.string().describe("The signed transaction information from the notification."),
}).describe("Notification details from the App Store");
