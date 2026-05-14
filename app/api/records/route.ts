import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import {
  errorResponse,
  parseNewRecord,
  readJsonBody,
  runMutation,
} from "@/lib/api-helpers";
import { StoreError, createRecord, listRecords } from "@/lib/erp-store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = await authenticate(request);
  if (authError) return authError;
  try {
    const records = await listRecords();
    return NextResponse.json(records);
  } catch (e) {
    if (e instanceof StoreError) {
      return errorResponse(500, e.message || "Failed to load records");
    }
    return errorResponse(
      500,
      e instanceof Error ? e.message : "Failed to load records",
    );
  }
}

export async function POST(request: Request) {
  const authError = await authenticate(request);
  if (authError) return authError;
  const body = await readJsonBody(request);
  if (body === null) return errorResponse(400, "Invalid JSON body");
  const parsed = parseNewRecord(body);
  if (!parsed.ok) return errorResponse(parsed.status, parsed.message);
  return runMutation(() => createRecord(parsed.value));
}
