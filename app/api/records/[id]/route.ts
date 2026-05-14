import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import { errorResponse } from "@/lib/api-helpers";
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
    return NextResponse.json(record);
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
