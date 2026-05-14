"use client";

import { useEffect, useRef, useState } from "react";

interface NoteModalProps {
  open: boolean;
  recordNumber: string;
  existingNotes: string;
  busy?: boolean;
  errorMessage?: string | null;
  onCancel: () => void;
  onSubmit: (note: string) => void;
}

export function NoteModal({
  open,
  recordNumber,
  existingNotes,
  busy = false,
  errorMessage,
  onCancel,
  onSubmit,
}: NoteModalProps) {
  const [value, setValue] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) {
      setValue("");
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [open, recordNumber]);

  if (!open) return null;

  const trimmed = value.trim();
  const isValid = trimmed.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="w-full max-w-lg rounded-sm border border-slate-300 bg-white p-5 shadow-lg">
        <h2 className="text-base font-semibold text-slate-900">Add note</h2>
        <p className="mt-1 text-xs text-slate-600">
          Record{" "}
          <span className="font-mono text-slate-800">{recordNumber}</span> ·
          Note will be timestamped and appended.
        </p>

        {existingNotes ? (
          <details className="mt-3 rounded-sm border border-slate-200 bg-slate-50">
            <summary className="cursor-pointer select-none px-2 py-1.5 text-[11px] font-medium text-slate-700">
              Existing notes
            </summary>
            <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap break-words px-2 pb-2 text-[11px] text-slate-600">
              {existingNotes}
            </pre>
          </details>
        ) : null}

        <form
          className="mt-3 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isValid || busy) return;
            onSubmit(trimmed);
          }}
        >
          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-600">
              New note
            </span>
            <textarea
              ref={textareaRef}
              rows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={busy}
              placeholder="What changed? What needs attention?"
              className="mt-1 w-full rounded-sm border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
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
              disabled={!isValid || busy}
              className="rounded-sm bg-slate-800 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
