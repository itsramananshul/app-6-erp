import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-helpers";
import { StoreError, getRecord } from "@/lib/erp-store";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
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
