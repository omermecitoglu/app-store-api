import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { type Environment, SignedDataVerifier } from "@apple/app-store-server-library";

export async function getDataVerifier() {
  if (!process.env.APP_BUNDLE_ID) throw new Error("APP_BUNDLE_ID is missing!");
  if (!process.env.APP_ID) throw new Error("APP_ID is missing!");
  const verifier = new SignedDataVerifier(
    [
      await fs.readFile(path.resolve("./certificates/AppleRootCA-G3.cer")),
    ],
    true,
    (process.env.NODE_ENV === "production" ? "Production" : "Sandbox") as Environment,
    process.env.APP_BUNDLE_ID,
    process.env.NODE_ENV === "production" ? parseInt(process.env.APP_ID) : undefined,
  );
  return verifier;
}
