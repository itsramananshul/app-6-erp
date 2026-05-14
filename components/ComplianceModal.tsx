"use client";

import { useEffect, useState } from "react";
import { COMPLIANCE_STATUSES, type ComplianceStatus } from "@/lib/types";
import { ComplianceBadge } from "./ComplianceBadge";

interface ComplianceModalProps {
  open: boolean;
  recordNumber: string;
  currentStatus: ComplianceStatus;
  busy?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onSubmit: (status: ComplianceStatus) => void;
}

export function ComplianceModal({
  open,
  recordNumber,
  currentStatus,
  busy = false,
  errorMessage,
  onCancel,
  onSubmit,
}: ComplianceModalProps) {
  const [selected, setSelected] = useState<ComplianceStatus>(currentStatus);

  useEffect(() => {
    if (open) setSelected(currentStatus);
  }, [open, currentStatus, recordNumber]);

  if (!open) return null;

  const unchanged = selected === currentStatus;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-sm border border-slate-300 bg-white p-5 shadow-lg">
        <h2 className="text-base font-semibold text-slate-900">
          Update compliance status
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Record{" "}
          <span className="font-mono text-slate-800">{recordNumber}</span>
        </p>

        <div className="mt-3 flex items-center gap-2 border border-slate-200 bg-slate-50 px-2 py-1.5">
          <span className="text-[11px] text-slate-600">Current:</span>
          <ComplianceBadge status={currentStatus} />
        </div>

        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (busy || unchanged) return;
            onSubmit(selected);
          }}
        >
          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              New compliance status
            </span>
            <select
              value={selected}
              onChange={(e) =>
                setSelected(e.target.value as ComplianceStatus)
              }
              disabled={busy}
              className="mt-1 w-full rounded-sm border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            >
              {COMPLIANCE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          {errorMessage ? (
            <p className="rounded-sm border border-rose-300 bg-rose-50 px-2 py-1.5 text-xs text-rose-800">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="rounded-sm border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || unchanged}
              className="rounded-sm bg-slate-800 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Saving…" : "Update compliance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
