import { defineRoute } from "@omer-x/next-openapi-route-handler";
import { z } from "zod";
import { setupClient } from "~/core/client";
import { findStatus } from "~/core/transaction";
import { getDataVerifier } from "~/core/verifier";
import { SubscriptionDTO } from "~/models/subscription";

export const { GET } = defineRoute({
  operationId: "getSubscription",
  method: "GET",
  summary: "Get a specific subscription by ID",
  description: "Retrieve details of a specific subscription by their ID",
  tags: ["Subscriptions"],
  pathParams: z.object({
    id: z.number().describe("ID of the subscription"),
  }),
  action: async ({ pathParams }) => {
    const subscriptionId = `${pathParams.id}`;
    const client = setupClient();
    const verifier = await getDataVerifier();
    try {
      const response = await client.getAllSubscriptionStatuses(subscriptionId);
      for (const groupItem of response.data ?? []) {
        for (const transaction of groupItem.lastTransactions ?? []) {
          if (!transaction.signedTransactionInfo || !transaction.signedRenewalInfo) continue;
          const transactionInfo = await verifier.verifyAndDecodeTransaction(transaction.signedTransactionInfo);
          /*
            {
              transactionId: '2000000924020994',
              originalTransactionId: '2000000921946125',
              webOrderLineItemId: '2000000100095926',
              bundleId: 'com.tusmate.app',
              productId: 'bronze_monthly',
              subscriptionGroupIdentifier: '21684104',
              purchaseDate: 1747863834000,
              originalPurchaseDate: 1747653847000,
              expiresDate: 1747867434000,
              quantity: 1,
              type: 'Auto-Renewable Subscription',
              appAccountToken: '5b19a239-b573-4293-a858-ebbe14dc6cc9',
              inAppOwnershipType: 'PURCHASED',
              signedDate: 1747865028054,
              environment: 'Sandbox',
              transactionReason: 'PURCHASE',
              storefront: 'IDN',
              storefrontId: '143476',
              price: 229000000,
              currency: 'IDR',
              appTransactionId: '704504393260214804'
            }
          */
          const renewalInfo = await verifier.verifyAndDecodeRenewalInfo(transaction.signedRenewalInfo);
          /*
            {
              originalTransactionId: '2000000921946125',
              autoRenewProductId: 'bronze_monthly',
              productId: 'bronze_monthly',
              autoRenewStatus: 1,
              renewalPrice: 229000000,
              currency: 'IDR',
              signedDate: 1747865907826,
              environment: 'Sandbox',
              recentSubscriptionStartDate: 1747863834000,
              renewalDate: 1747867434000,
              appTransactionId: '704504393260214804',
              appAccountToken: '5b19a239-b573-4293-a858-ebbe14dc6cc9'
            }
          */

          const status = findStatus(transaction.status, renewalInfo.autoRenewStatus);
          return Response.json({
            id: transactionInfo.originalTransactionId ?? subscriptionId,
            variantName: transactionInfo.productId ?? "unknown",
            billingCycle: transactionInfo.productId?.endsWith("yearly") ? 12 : 1,
            billingAnchor: new Date(renewalInfo.renewalDate ?? 0).getDate(),
            status,
            endsAt: status === "cancelled" ? new Date(transactionInfo.expiresDate ?? 0).toISOString() : null,
            renewsAt: new Date(renewalInfo.renewalDate ?? 0).toISOString(),
          });
        }
      }
      throw { httpStatusCode: 404 };
    } catch (error) {
      if (error && typeof error === "object" && "httpStatusCode" in error && error.httpStatusCode === 404) {
        return new Response(JSON.stringify({ errorCode: "SUBSCRIPTION_NOT_FOUND" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      throw error;
    }
  },
  responses: {
    200: { description: "Subscription details retrieved successfully", content: SubscriptionDTO },
    404: { description: "Subscription not found", content: z.object({ errorCode: z.enum(["SUBSCRIPTION_NOT_FOUND"]) }) },
  },
});
