import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
import { SubscriptionDTO } from "~/models/subscription";

export async function GET() {
  const spec = await generateOpenApiSpec({
    SubscriptionDTO,
  });
  return Response.json(spec);
}
