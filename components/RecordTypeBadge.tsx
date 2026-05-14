import type { RecordType } from "@/lib/types";

const styles: Record<RecordType, string> = {
  COMPLIANCE: "bg-slate-100 text-slate-700 ring-slate-300",
  AUDIT: "bg-purple-50 text-purple-800 ring-purple-300",
  FINANCIAL: "bg-blue-50 text-blue-800 ring-blue-300",
  REGULATORY: "bg-orange-50 text-orange-800 ring-orange-300",
  SAFETY_CERTIFICATION: "bg-teal-50 text-teal-800 ring-teal-300",
};

const labels: Record<RecordType, string> = {
  COMPLIANCE: "COMPLIANCE",
  AUDIT: "AUDIT",
  FINANCIAL: "FINANCIAL",
  REGULATORY: "REGULATORY",
  SAFETY_CERTIFICATION: "SAFETY CERT",
};

export function RecordTypeBadge({ type }: { type: RecordType }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}
