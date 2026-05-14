import {
  errorResponse,
  parseCompliance,
  readJsonBody,
  runMutation,
} from "@/lib/api-helpers";
import { updateCompliance } from "@/lib/erp-store";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await readJsonBody(request);
  if (body === null) return errorResponse(400, "Invalid JSON body");
  const parsed = parseCompliance(body);
  if (!parsed.ok) return errorResponse(parsed.status, parsed.message);
  return runMutation(() => updateCompliance(params.id, parsed.value));
}
