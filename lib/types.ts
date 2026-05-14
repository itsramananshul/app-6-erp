export type RecordStatus =
  | "PENDING_REVIEW"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "OVERDUE";

export type ComplianceStatus =
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "UNDER_REVIEW"
  | "EXEMPT";

export type RecordType =
  | "COMPLIANCE"
  | "AUDIT"
  | "FINANCIAL"
  | "REGULATORY"
  | "SAFETY_CERTIFICATION";

export interface ErpRecord {
  id: string;
  instance_name: string;
  record_number: string;
  record_type: RecordType;
  title: string;
  description: string;
  department: string;
  responsible_party: string;
  status: RecordStatus;
  compliance_status: ComplianceStatus;
  due_date: string;
  completed_date: string | null;
  financial_impact: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface StatusResponse {
  instanceName: string;
  type: "erp";
  recordCount: number;
  nonCompliantCount: number;
  overdueCount: number;
  health: "ok" | "degraded";
  timestamp: string;
}

export interface ApiErrorBody {
  success: false;
  error: string;
}

export interface MutationSuccessBody {
  success: true;
  record: ErpRecord;
}

export const RECORD_STATUSES: readonly RecordStatus[] = [
  "PENDING_REVIEW",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
  "OVERDUE",
];

export const COMPLIANCE_STATUSES: readonly ComplianceStatus[] = [
  "COMPLIANT",
  "NON_COMPLIANT",
  "UNDER_REVIEW",
  "EXEMPT",
];

export const RECORD_TYPES: readonly RecordType[] = [
  "COMPLIANCE",
  "AUDIT",
  "FINANCIAL",
  "REGULATORY",
  "SAFETY_CERTIFICATION",
];

export const DEPARTMENTS = [
  "Operations",
  "Finance",
  "Legal",
  "Quality Assurance",
  "Safety",
  "Logistics",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export interface NewRecordInput {
  record_number: string;
  record_type: RecordType;
  title: string;
  description: string;
  department: string;
  responsible_party: string;
  due_date: string;
  financial_impact: number;
  notes: string;
}
