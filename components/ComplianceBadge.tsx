import type { ComplianceStatus } from "@/lib/types";

const styles: Record<ComplianceStatus, string> = {
  COMPLIANT: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  NON_COMPLIANT: "bg-rose-50 text-rose-800 ring-rose-300",
  UNDER_REVIEW: "bg-blue-50 text-blue-800 ring-blue-300",
  EXEMPT: "bg-slate-100 text-slate-700 ring-slate-300",
};

const labels: Record<ComplianceStatus, string> = {
  COMPLIANT: "COMPLIANT",
  NON_COMPLIANT: "NON-COMPLIANT",
  UNDER_REVIEW: "UNDER REVIEW",
  EXEMPT: "EXEMPT",
};

export function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
