import { NextResponse } from "next/server";
import { StoreError } from "./erp-store";
import {
  COMPLIANCE_STATUSES,
  RECORD_STATUSES,
  RECORD_TYPES,
  type ApiErrorBody,
  type ComplianceStatus,
  type ErpRecord,
  type MutationSuccessBody,
  type NewRecordInput,
  type RecordStatus,
  type RecordType,
} from "./types";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-api-key, content-type",
} as const;

export function optionsResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "x-api-key, content-type",
    },
  });
}

export function errorResponse(status: number, message: string) {
  return NextResponse.json<ApiErrorBody>(
    { success: false, error: message },
    { status, headers: CORS_HEADERS },
  );
}

export function mutationSuccessResponse(record: ErpRecord) {
  return NextResponse.json<MutationSuccessBody>(
    {
      success: true,
      record,
    },
    { headers: CORS_HEADERS },
  );
}

export function mapStoreError(e: StoreError) {
  switch (e.kind) {
    case "not_found":
      return errorResponse(404, e.message || "Record not found");
    case "db_error":
      return errorResponse(500, e.message || "Database error");
  }
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function runMutation(
  fn: () => Promise<ErpRecord>,
): Promise<Response> {
  try {
    const record = await fn();
    return mutationSuccessResponse(record);
  } catch (e) {
    if (e instanceof StoreError) return mapStoreError(e);
    const message = e instanceof Error ? e.message : "Server error";
    return errorResponse(500, message);
  }
}

export type FieldParse<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; message: string };

export function parseStatus(body: unknown): FieldParse<RecordStatus> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, message: "Invalid JSON body" };
  }
  const value = (body as { status?: unknown }).status;
  if (typeof value !== "string") {
    return { ok: false, status: 400, message: "status must be a string" };
  }
  if (!RECORD_STATUSES.includes(value as RecordStatus)) {
    return {
      ok: false,
      status: 400,
      message: `status must be one of: ${RECORD_STATUSES.join(", ")}`,
    };
  }
  return { ok: true, value: value as RecordStatus };
}

export function parseCompliance(
  body: unknown,
): FieldParse<ComplianceStatus> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, message: "Invalid JSON body" };
  }
  const value = (body as { complianceStatus?: unknown }).complianceStatus;
  if (typeof value !== "string") {
    return {
      ok: false,
      status: 400,
      message: "complianceStatus must be a string",
    };
  }
  if (!COMPLIANCE_STATUSES.includes(value as ComplianceStatus)) {
    return {
      ok: false,
      status: 400,
      message: `complianceStatus must be one of: ${COMPLIANCE_STATUSES.join(", ")}`,
    };
  }
  return { ok: true, value: value as ComplianceStatus };
}

export function parseNote(body: unknown): FieldParse<string> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, message: "Invalid JSON body" };
  }
  const value = (body as { note?: unknown }).note;
  if (typeof value !== "string" || value.trim() === "") {
    return {
      ok: false,
      status: 400,
      message: "note must be a non-empty string",
    };
  }
  return { ok: true, value };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseNewRecord(body: unknown): FieldParse<NewRecordInput> {
  if (typeof body !== "object" || body === null) {
    return { ok: false, status: 400, message: "Invalid JSON body" };
  }
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.record_number)) {
    return { ok: false, status: 400, message: "record_number is required" };
  }
  if (!isNonEmptyString(b.title)) {
    return { ok: false, status: 400, message: "title is required" };
  }
  if (!isNonEmptyString(b.department)) {
    return { ok: false, status: 400, message: "department is required" };
  }
  if (!isNonEmptyString(b.responsible_party)) {
    return {
      ok: false,
      status: 400,
      message: "responsible_party is required",
    };
  }
  if (
    typeof b.record_type !== "string" ||
    !RECORD_TYPES.includes(b.record_type as RecordType)
  ) {
    return {
      ok: false,
      status: 400,
      message: `record_type must be one of: ${RECORD_TYPES.join(", ")}`,
    };
  }
  if (typeof b.due_date !== "string" || !ISO_DATE_RE.test(b.due_date)) {
    return {
      ok: false,
      status: 400,
      message: "due_date must be a date string in YYYY-MM-DD format",
    };
  }
  if (
    typeof b.financial_impact !== "number" ||
    !Number.isFinite(b.financial_impact) ||
    b.financial_impact < 0
  ) {
    return {
      ok: false,
      status: 400,
      message: "financial_impact must be a non-negative number",
    };
  }

  const description = typeof b.description === "string" ? b.description : "";
  const notes = typeof b.notes === "string" ? b.notes : "";

  return {
    ok: true,
    value: {
      record_number: b.record_number,
      record_type: b.record_type as RecordType,
      title: b.title,
      description,
      department: b.department,
      responsible_party: b.responsible_party,
      due_date: b.due_date,
      financial_impact: b.financial_impact,
      notes,
    },
  };
}
