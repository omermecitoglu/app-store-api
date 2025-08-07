import { defineRoute } from "@omer-x/next-openapi-route-handler";
import { z } from "zod";
import { getDataVerifier } from "~/core/verifier";
import { TransactionDTO } from "~/models/transaction";

export const { POST } = defineRoute({
  operationId: "verifyTransaction",
  method: "POST",
  summary: "Verify a transaction from the App Store",
  description: "Verifies the authenticity and integrity of a transaction received from the App Store.",
  tags: ["Transactions"],
  requestBody: z.object({
    payload: z.string().describe("Transaction information signed by the App Store, in JSON Web Signature (JWS) format."),
  }),
  action: async ({ body }) => {
    const verifier = await getDataVerifier();
    const transactionInfo = await verifier.verifyAndDecodeTransaction(body.payload);
    if (!transactionInfo.originalTransactionId) {
      return new Response(JSON.stringify({ errorCode: "MISSING_TRANSACTION_ID" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!transactionInfo.appAccountToken) {
      return new Response(JSON.stringify({ errorCode: "MISSING_APP_ACCOUNT_TOKEN" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!transactionInfo.productId) {
      return new Response(JSON.stringify({ errorCode: "MISSING_PRODUCT_ID" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    return Response.json({
      originalTransactionId: transactionInfo.originalTransactionId,
      appAccountToken: transactionInfo.appAccountToken,
      productId: transactionInfo.productId,
    });
  },
  responses: {
    200: { description: "Transaction verified successfully", content: TransactionDTO },
    422: {
      description: "Missing required data in the transaction",
      content: z.object({
        errorCode: z.enum([
          "MISSING_TRANSACTION_ID",
          "MISSING_APP_ACCOUNT_TOKEN",
          "MISSING_PRODUCT_ID",
        ]),
      }),
    },
  },
});
