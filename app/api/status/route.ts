import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-helpers";
import {
  StoreError,
  nonCompliantCount,
  overdueCount,
  recordCount,
} from "@/lib/erp-store";
import type { StatusResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [count, nonCompliant, overdue] = await Promise.all([
      recordCount(),
      nonCompliantCount(),
      overdueCount(),
    ]);
    const payload: StatusResponse = {
      instanceName: process.env.INSTANCE_NAME?.trim() ?? "Unknown Instance",
      type: "erp",
      recordCount: count,
      nonCompliantCount: nonCompliant,
      overdueCount: overdue,
      health: nonCompliant > 0 || overdue > 0 ? "degraded" : "ok",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(payload);
  } catch (e) {
    if (e instanceof StoreError) {
      return errorResponse(500, e.message || "Status check failed");
    }
    return errorResponse(
      500,
      e instanceof Error ? e.message : "Status check failed",
    );
  }
}
