"use client";

import {
  COMPLIANCE_STATUSES,
  RECORD_STATUSES,
  RECORD_TYPES,
  type ComplianceStatus,
  type RecordStatus,
  type RecordType,
} from "@/lib/types";

export type StatusFilter = RecordStatus | "ALL";
export type ComplianceFilter = ComplianceStatus | "ALL";
export type TypeFilter = RecordType | "ALL";

interface FilterBarProps {
  statusFilter: StatusFilter;
  complianceFilter: ComplianceFilter;
  typeFilter: TypeFilter;
  search: string;
  nonCompliantOnly: boolean;
  onStatusChange: (v: StatusFilter) => void;
  onComplianceChange: (v: ComplianceFilter) => void;
  onTypeChange: (v: TypeFilter) => void;
  onSearchChange: (v: string) => void;
  onNonCompliantChange: (v: boolean) => void;
  resultCount: number;
  totalCount: number;
  onReset: () => void;
}

const selectClass =
  "rounded-sm border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400";

export function FilterBar({
  statusFilter,
  complianceFilter,
  typeFilter,
  search,
  nonCompliantOnly,
  onStatusChange,
  onComplianceChange,
  onTypeChange,
  onSearchChange,
  onNonCompliantChange,
  resultCount,
  totalCount,
  onReset,
}: FilterBarProps) {
  const hasFilters =
    statusFilter !== "ALL" ||
    complianceFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    search.trim() !== "" ||
    nonCompliantOnly;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-sm border border-slate-200 bg-slate-50 px-3 py-2">
      <label className="flex flex-col text-[11px] text-slate-600">
        <span className="mb-1 font-medium uppercase tracking-wider">
          Status
        </span>
        <select
          className={selectClass}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        >
          <option value="ALL">All statuses</option>
          {RECORD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-[11px] text-slate-600">
        <span className="mb-1 font-medium uppercase tracking-wider">
          Compliance
        </span>
        <select
          className={selectClass}
          value={complianceFilter}
          onChange={(e) =>
            onComplianceChange(e.target.value as ComplianceFilter)
          }
        >
          <option value="ALL">All compliance</option>
          {COMPLIANCE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-[11px] text-slate-600">
        <span className="mb-1 font-medium uppercase tracking-wider">
          Type
        </span>
        <select
          className={selectClass}
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
        >
          <option value="ALL">All types</option>
          {RECORD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-1 min-w-[220px] flex-col text-[11px] text-slate-600">
        <span className="mb-1 font-medium uppercase tracking-wider">
          Search
        </span>
        <input
          type="text"
          placeholder="Record #, title, department, or responsible"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${selectClass} w-full`}
        />
      </label>

      <label className="flex items-center gap-2 self-end pb-1 text-[11px] text-slate-700">
        <input
          type="checkbox"
          checked={nonCompliantOnly}
          onChange={(e) => onNonCompliantChange(e.target.checked)}
          className="h-4 w-4 rounded-sm border-slate-400 text-rose-600 focus:ring-rose-500"
        />
        Non-compliant only
      </label>

      <div className="ml-auto flex items-center gap-3 self-end pb-0.5 text-[11px] text-slate-600">
        <span className="tabular-nums">
          Showing <span className="text-slate-800">{resultCount}</span> of{" "}
          {totalCount}
        </span>
        {hasFilters ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-sm border border-slate-300 bg-white px-2 py-0.5 text-[11px] text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
