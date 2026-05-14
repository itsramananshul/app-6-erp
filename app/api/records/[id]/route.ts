import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import {
  CORS_HEADERS,
  errorResponse,
  optionsResponse,
} from "@/lib/api-helpers";
import { StoreError, getRecord } from "@/lib/erp-store";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const authError = await authenticate(request);
  if (authError) return authError;
  try {
    const record = await getRecord(params.id);
    if (!record) return errorResponse(404, "Record not found");
    return NextResponse.json(record, { headers: CORS_HEADERS });
  } catch (e) {
    if (e instanceof StoreError) {
      return errorResponse(500, e.message || "Failed to load record");
    }
    return errorResponse(
      500,
      e instanceof Error ? e.message : "Failed to load record",
    );
  }
}

export const OPTIONS = optionsResponse;
