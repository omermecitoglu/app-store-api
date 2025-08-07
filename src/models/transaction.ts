import { z } from "zod";

/* eslint-disable @stylistic/max-len */

export const TransactionDTO = z.object({
  originalTransactionId: z.string().describe("The original transaction identifier of a purchase."),
  appAccountToken: z.string().describe("The UUID that an app optionally generates to map a customer’s in-app purchase with its resulting App Store transaction."),
  productId: z.string().describe("The unique identifier for the product, that you create in App Store Connect."),
}).describe("Transaction details from the App Store");
