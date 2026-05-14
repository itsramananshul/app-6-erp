import type { RecordStatus } from "@/lib/types";

const styles: Record<RecordStatus, string> = {
  PENDING_REVIEW: "bg-slate-100 text-slate-700 ring-slate-300",
  IN_REVIEW: "bg-blue-50 text-blue-800 ring-blue-300",
  APPROVED: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  REJECTED: "bg-rose-50 text-rose-800 ring-rose-300",
  OVERDUE: "bg-amber-50 text-amber-800 ring-amber-300",
};

const labels: Record<RecordStatus, string> = {
  PENDING_REVIEW: "PENDING REVIEW",
  IN_REVIEW: "IN REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  OVERDUE: "OVERDUE",
};

export function StatusBadge({ status }: { status: RecordStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
