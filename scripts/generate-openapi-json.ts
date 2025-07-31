import { writeFile } from "fs/promises";
import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
// @ts-expect-error: whatever?
import { SubscriptionDTO } from "../src/models/subscription.ts";

(async () => {
  const spec = await generateOpenApiSpec({
    SubscriptionDTO,
  });
  await writeFile("./openapi.json", JSON.stringify(spec), "utf-8");
})();
