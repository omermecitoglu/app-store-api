import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
import { NotificationDTO } from "~/models/notification";
import { SubscriptionDTO } from "~/models/subscription";

export async function GET() {
  const spec = await generateOpenApiSpec({
    NotificationDTO,
    SubscriptionDTO,
  });
  return Response.json(spec);
}
