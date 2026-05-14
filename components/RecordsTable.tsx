"use client";

import type { ErpRecord } from "@/lib/types";
import { ComplianceBadge } from "./ComplianceBadge";
import { RecordTypeBadge } from "./RecordTypeBadge";
import { StatusBadge } from "./StatusBadge";

export type RecordActionKind = "status" | "compliance" | "note";

interface RecordsTableProps {
  records: ErpRecord[];
  today: string;
  onAction: (record: ErpRecord, action: RecordActionKind) => void;
}

function formatCurrency(n: number): string {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function RecordsTable({ records, today, onAction }: RecordsTableProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100 text-[10px] uppercase tracking-wider text-slate-600">
            <tr>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Record #</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Type</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Title</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Department</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Responsible</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Status</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Compliance</th>
              <th scope="col" className="px-2 py-2 text-left font-semibold">Due Date</th>
              <th scope="col" className="px-2 py-2 text-right font-semibold">Financial Impact</th>
              <th scope="col" className="px-2 py-2 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-[13px]">
            {records.map((r, idx) => {
              const overdue =
                r.due_date < today &&
                r.status !== "APPROVED" &&
                r.compliance_status !== "EXEMPT";
              const zebra = idx % 2 === 0 ? "" : "bg-slate-50/40";
              const overdueTint = r.status === "OVERDUE" ? "bg-amber-50" : "";
              const leftBorder =
                r.compliance_status === "NON_COMPLIANT"
                  ? "[&>td:first-child]:border-l-2 [&>td:first-child]:border-rose-500"
                  : "";
              return (
                <tr
                  key={r.id}
                  className={`hover:bg-slate-50 ${zebra} ${overdueTint} ${leftBorder}`}
                >
                  <td className="whitespace-nowrap px-2 py-1.5 font-mono text-[12px] text-slate-700">
                    {r.record_number}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5">
                    <RecordTypeBadge type={r.record_type} />
                  </td>
                  <td className="max-w-[280px] truncate px-2 py-1.5 text-slate-800">
                    {r.title}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-slate-700">
                    {r.department}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-slate-700">
                    {r.responsible_party}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5">
                    <ComplianceBadge status={r.compliance_status} />
                  </td>
                  <td
                    className={`whitespace-nowrap px-2 py-1.5 tabular-nums ${
                      overdue ? "text-rose-700 font-semibold" : "text-slate-700"
                    }`}
                  >
                    {r.due_date}
                    {r.completed_date ? (
                      <div className="text-[10px] text-emerald-700/80">
                        completed {r.completed_date}
                      </div>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right tabular-nums text-slate-800">
                    {formatCurrency(r.financial_impact)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => onAction(r, "status")}
                        className="rounded-sm border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        Status
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction(r, "compliance")}
                        className="rounded-sm border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        Compliance
                      </button>
                      <button
                        type="button"
                        onClick={() => onAction(r, "note")}
                        className="rounded-sm border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        Note
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  No records match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
