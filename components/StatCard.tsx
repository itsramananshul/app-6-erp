interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
}

const borderStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "border-l-slate-400",
  warning: "border-l-amber-500",
  danger: "border-l-rose-500",
  success: "border-l-emerald-500",
};

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: StatCardProps) {
  return (
    <div
      className={`rounded-sm border border-slate-200 border-l-4 bg-white px-4 py-3 ${borderStyles[tone]}`}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}
