import { AppStoreServerAPIClient, type Environment } from "@apple/app-store-server-library";

export function setupClient() {
  if (!process.env.APP_BUNDLE_ID) throw new Error("APP_BUNDLE_ID is missing");
  if (!process.env.APPLE_IAP_ISSUER_ID) throw new Error("APPLE_IAP_ISSUER_ID is missing");
  if (!process.env.APPLE_IAP_KEY_ID) throw new Error("APPLE_IAP_KEY_ID is missing");
  if (!process.env.APPLE_IAP_PRIVATE_KEY) throw new Error("APPLE_IAP_PRIVATE_KEY is missing");

  const client = new AppStoreServerAPIClient(
    process.env.APPLE_IAP_PRIVATE_KEY,
    process.env.APPLE_IAP_KEY_ID,
    process.env.APPLE_IAP_ISSUER_ID,
    process.env.APP_BUNDLE_ID,
    (process.env.NODE_ENV === "production" ? "Production" : "Sandbox") as Environment,
  );
  return client;
}
