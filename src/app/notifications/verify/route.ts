import { defineRoute } from "@omer-x/next-openapi-route-handler";
import { z } from "zod";
import { resolveEventName } from "~/core/notification";
import { getDataVerifier } from "~/core/verifier";
import { NotificationDTO } from "~/models/notification";

export const { POST } = defineRoute({
  operationId: "verifyNotification",
  method: "POST",
  summary: "Verify a notification from the App Store",
  description: "Verifies the authenticity and integrity of a notification received from the App Store.",
  tags: ["Notifications"],
  requestBody: z.object({
    payload: z.string().describe("Notification information signed by the App Store, in JSON Web Signature (JWS) format."),
  }),
  action: async ({ body }) => {
    const verifier = await getDataVerifier();
    const verifiedNotification = await verifier.verifyAndDecodeNotification(body.payload);
    if (!verifiedNotification.data) {
      return new Response(JSON.stringify({ errorCode: "MISSING_NOTIFICATION_DATA" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!verifiedNotification.data.signedTransactionInfo) {
      return new Response(JSON.stringify({ errorCode: "MISSING_TRANSACTION_PAYLOAD" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
    return Response.json({
      eventName: resolveEventName(verifiedNotification.notificationType, verifiedNotification.subtype),
      transactionPayload: verifiedNotification.data.signedTransactionInfo,
    });
  },
  responses: {
    200: { description: "Notification verified successfully", content: NotificationDTO },
    422: {
      description: "Missing required data in the notification",
      content: z.object({
        errorCode: z.enum([
          "MISSING_NOTIFICATION_DATA",
          "MISSING_TRANSACTION_PAYLOAD",
        ]),
      }),
    },
  },
});
