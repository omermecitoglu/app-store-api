import generateOpenApiSpec from "@omer-x/next-openapi-json-generator";
import { NotificationDTO } from "~/models/notification";
import { SubscriptionDTO } from "~/models/subscription";
import { TransactionDTO } from "~/models/transaction";

export async function GET() {
  const spec = await generateOpenApiSpec({
    NotificationDTO,
    TransactionDTO,
    SubscriptionDTO,
  });
  return Response.json(spec);
}
