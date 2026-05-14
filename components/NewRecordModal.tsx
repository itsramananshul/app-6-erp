"use client";

import { useEffect, useState } from "react";
import {
  DEPARTMENTS,
  RECORD_TYPES,
  type NewRecordInput,
  type RecordType,
} from "@/lib/types";

interface NewRecordModalProps {
  open: boolean;
  busy?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onSubmit: (input: NewRecordInput) => void;
}

interface FormState {
  record_number: string;
  record_type: RecordType;
  title: string;
  description: string;
  department: string;
  responsible_party: string;
  due_date: string;
  financial_impact: string;
  notes: string;
}

function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const emptyForm = (): FormState => ({
  record_number: "",
  record_type: "COMPLIANCE",
  title: "",
  description: "",
  department: DEPARTMENTS[0],
  responsible_party: "",
  due_date: todayISO(),
  financial_impact: "0",
  notes: "",
});

const inputClass =
  "w-full rounded-sm border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60";

const labelText =
  "text-[11px] font-medium uppercase tracking-wider text-slate-600";

export function NewRecordModal({
  open,
  busy = false,
  errorMessage,
  onCancel,
  onSubmit,
}: NewRecordModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm());
      setTouched(false);
    }
  }, [open]);

  if (!open) return null;

  const impact = Number.parseFloat(form.financial_impact);

  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.record_number.trim()) errors.record_number = "Required";
  if (!form.title.trim()) errors.title = "Required";
  if (!form.responsible_party.trim()) errors.responsible_party = "Required";
  if (!form.due_date) errors.due_date = "Required";
  if (!Number.isFinite(impact) || impact < 0)
    errors.financial_impact = "Must be a non-negative number";

  const isValid = Object.keys(errors).length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="w-full max-w-2xl rounded-sm border border-slate-300 bg-white p-5 shadow-lg">
        <h2 className="text-base font-semibold text-slate-900">
          Create ERP record
        </h2>
        <p className="mt-1 text-xs text-slate-600">
          Record is scoped to the current instance. New records start in
          PENDING_REVIEW / UNDER_REVIEW.
        </p>

        <form
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (!isValid || busy) return;
            onSubmit({
              record_number: form.record_number.trim(),
              record_type: form.record_type,
              title: form.title.trim(),
              description: form.description.trim(),
              department: form.department,
              responsible_party: form.responsible_party.trim(),
              due_date: form.due_date,
              financial_impact: impact,
              notes: form.notes.trim(),
            });
          }}
        >
          <label className="block">
            <span className={labelText}>Record Number</span>
            <input
              className={inputClass}
              value={form.record_number}
              onChange={(e) =>
                setForm((s) => ({ ...s, record_number: e.target.value }))
              }
              disabled={busy}
              placeholder="ERP-F1-099"
            />
            {touched && errors.record_number ? (
              <span className="mt-1 block text-[11px] text-rose-700">
                {errors.record_number}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className={labelText}>Type</span>
            <select
              className={inputClass}
              value={form.record_type}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  record_type: e.target.value as RecordType,
                }))
              }
              disabled={busy}
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className={labelText}>Title</span>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) =>
                setForm((s) => ({ ...s, title: e.target.value }))
              }
              disabled={busy}
            />
            {touched && errors.title ? (
              <span className="mt-1 block text-[11px] text-rose-700">
                {errors.title}
              </span>
            ) : null}
          </label>

          <label className="block sm:col-span-2">
            <span className={labelText}>Description (optional)</span>
            <textarea
              className={inputClass}
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm((s) => ({ ...s, description: e.target.value }))
              }
              disabled={busy}
            />
          </label>

          <label className="block">
            <span className={labelText}>Department</span>
            <select
              className={inputClass}
              value={form.department}
              onChange={(e) =>
                setForm((s) => ({ ...s, department: e.target.value }))
              }
              disabled={busy}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelText}>Responsible Party</span>
            <input
              className={inputClass}
              value={form.responsible_party}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  responsible_party: e.target.value,
                }))
              }
              disabled={busy}
            />
            {touched && errors.responsible_party ? (
              <span className="mt-1 block text-[11px] text-rose-700">
                {errors.responsible_party}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className={labelText}>Due Date</span>
            <input
              type="date"
              className={inputClass}
              value={form.due_date}
              onChange={(e) =>
                setForm((s) => ({ ...s, due_date: e.target.value }))
              }
              disabled={busy}
            />
            {touched && errors.due_date ? (
              <span className="mt-1 block text-[11px] text-rose-700">
                {errors.due_date}
              </span>
            ) : null}
          </label>

          <label className="block">
            <span className={labelText}>Financial Impact (USD)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              className={inputClass}
              value={form.financial_impact}
              onChange={(e) =>
                setForm((s) => ({ ...s, financial_impact: e.target.value }))
              }
              disabled={busy}
            />
            {touched && errors.financial_impact ? (
              <span className="mt-1 block text-[11px] text-rose-700">
                {errors.financial_impact}
              </span>
            ) : null}
          </label>

          <label className="block sm:col-span-2">
            <span className={labelText}>Notes (optional)</span>
            <textarea
              className={inputClass}
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((s) => ({ ...s, notes: e.target.value }))
              }
              disabled={busy}
            />
          </label>

          {errorMessage ? (
            <p className="sm:col-span-2 rounded-sm border border-rose-300 bg-rose-50 px-2 py-1.5 text-xs text-rose-800">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2 sm:col-span-2">
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
              disabled={busy || (touched && !isValid)}
              className="rounded-sm bg-slate-800 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Creating…" : "Create record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
