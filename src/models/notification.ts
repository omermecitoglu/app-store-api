import { z } from "zod";

/* eslint-disable @stylistic/max-len */

export const NotificationDTO = z.object({
  eventName: z.enum([
    "TEST",
    "SUBSCRIBED:INITIAL_BUY", // Customer subscribes for the first time to any subscription within a subscription group.
    "SUBSCRIBED:RESUBSCRIBE", // Customer resubscribes to any subscription from the same subscription group as their expired subscription.
    "DID_RENEW", // The subscription successfully auto-renews.
    "DID_RENEW:BILLING_RECOVERY", // The billing retry successfully recovers the subscription.
    "DID_FAIL_TO_RENEW", // The subscription fails to renew and enters the billing retry period.
    "DID_FAIL_TO_RENEW:GRACE_PERIOD", // The subscription fails to renew and enters the billing retry period with Billing Grace Period enabled.
    "DID_CHANGE_RENEWAL_PREF", // Customer reverts to the previous subscription, effectively canceling their downgrade.
    "DID_CHANGE_RENEWAL_PREF:UPGRADE", // Customer upgrades a subscription within the same subscription group.
    "DID_CHANGE_RENEWAL_PREF:DOWNGRADE", // Customer downgrades a subscription within the same subscription group.
    "DID_CHANGE_RENEWAL_STATUS", // Customer canceled the subscription after receiving a price increase notice or a request to consent to a price increase.
    "EXPIRED:VOLUNTARY", // The subscription expires because the customer chose to cancel it.
    "EXPIRED:BILLING_RETRY", // The subscription expires because the billing retry period ends without recovering the subscription.
    "EXPIRED:PRODUCT_NOT_FOR_SALE", // The subscription expires because the developer removed the subscription from sale and the renewal fails.
  ]).describe("The name of the event triggered by the notification."),
  transactionPayload: z.string().describe("The signed transaction information from the notification."),
}).describe("Notification details from the App Store");
