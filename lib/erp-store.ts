import { ERP_TABLE, getInstanceName, getSupabase } from "./supabase";
import type {
  ComplianceStatus,
  ErpRecord,
  NewRecordInput,
  RecordStatus,
  RecordType,
} from "./types";

export type StoreErrorKind = "not_found" | "db_error";

export class StoreError extends Error {
  readonly kind: StoreErrorKind;
  constructor(kind: StoreErrorKind, message?: string) {
    super(message ?? kind);
    this.kind = kind;
    this.name = "StoreError";
  }
}

interface DbRow {
  id: string;
  instance_name: string;
  record_number: string;
  record_type: string;
  title: string;
  description: string;
  department: string;
  responsible_party: string;
  status: string;
  compliance_status: string;
  due_date: string;
  completed_date: string | null;
  financial_impact: number | string;
  notes: string;
  created_at: string;
  updated_at: string;
}

function n(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function toRecord(row: DbRow): ErpRecord {
  return {
    id: row.id,
    instance_name: row.instance_name,
    record_number: row.record_number,
    record_type: row.record_type as RecordType,
    title: row.title,
    description: row.description,
    department: row.department,
    responsible_party: row.responsible_party,
    status: row.status as RecordStatus,
    compliance_status: row.compliance_status as ComplianceStatus,
    due_date: row.due_date,
    completed_date: row.completed_date,
    financial_impact: n(row.financial_impact),
    notes: row.notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function listRecords(): Promise<ErpRecord[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(ERP_TABLE)
    .select("*")
    .eq("instance_name", getInstanceName())
    .order("due_date", { ascending: true });

  if (error) throw new StoreError("db_error", error.message);
  return ((data as DbRow[] | null) ?? []).map(toRecord);
}

export async function getRecord(id: string): Promise<ErpRecord | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(ERP_TABLE)
    .select("*")
    .eq("instance_name", getInstanceName())
    .eq("id", id)
    .maybeSingle();

  if (error) throw new StoreError("db_error", error.message);
  return data ? toRecord(data as DbRow) : null;
}

export async function recordCount(): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from(ERP_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("instance_name", getInstanceName());

  if (error) throw new StoreError("db_error", error.message);
  return count ?? 0;
}

export async function nonCompliantCount(): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from(ERP_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("instance_name", getInstanceName())
    .eq("compliance_status", "NON_COMPLIANT");

  if (error) throw new StoreError("db_error", error.message);
  return count ?? 0;
}

export async function overdueCount(): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from(ERP_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("instance_name", getInstanceName())
    .eq("status", "OVERDUE");

  if (error) throw new StoreError("db_error", error.message);
  return count ?? 0;
}

type Patch = Partial<
  Pick<
    DbRow,
    "status" | "compliance_status" | "completed_date" | "notes"
  >
>;

async function patchById(id: string, patch: Patch): Promise<ErpRecord> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(ERP_TABLE)
    .update(patch)
    .eq("instance_name", getInstanceName())
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new StoreError("db_error", error.message);
  if (!data) throw new StoreError("not_found", "Record not found");
  return toRecord(data as DbRow);
}

export async function updateStatus(
  id: string,
  status: RecordStatus,
): Promise<ErpRecord> {
  const patch: Patch = { status };
  if (status === "APPROVED") {
    patch.completed_date = todayISO();
  }
  return patchById(id, patch);
}

export function updateCompliance(
  id: string,
  complianceStatus: ComplianceStatus,
): Promise<ErpRecord> {
  return patchById(id, { compliance_status: complianceStatus });
}

export async function addNote(id: string, note: string): Promise<ErpRecord> {
  const current = await getRecord(id);
  if (!current) throw new StoreError("not_found", "Record not found");
  const stamped = `[${new Date().toISOString()}] ${note.trim()}`;
  const existing = current.notes?.trim() ?? "";
  const merged = existing.length > 0 ? `${existing}\n${stamped}` : stamped;
  return patchById(id, { notes: merged });
}

export async function createRecord(
  data: NewRecordInput,
): Promise<ErpRecord> {
  const supabase = getSupabase();
  const row = {
    instance_name: getInstanceName(),
    record_number: data.record_number,
    record_type: data.record_type,
    title: data.title,
    description: data.description,
    department: data.department,
    responsible_party: data.responsible_party,
    status: "PENDING_REVIEW" as RecordStatus,
    compliance_status: "UNDER_REVIEW" as ComplianceStatus,
    due_date: data.due_date,
    completed_date: null,
    financial_impact: data.financial_impact,
    notes: data.notes,
  };
  const { data: inserted, error } = await supabase
    .from(ERP_TABLE)
    .insert(row)
    .select("*")
    .maybeSingle();
  if (error) throw new StoreError("db_error", error.message);
  if (!inserted) throw new StoreError("db_error", "Insert returned no row");
  return toRecord(inserted as DbRow);
}
