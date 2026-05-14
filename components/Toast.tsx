"use client";

export type ToastKind = "success" | "error";

export interface ToastState {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  onClose: () => void;
}

const styles: Record<ToastKind, string> = {
  success: "bg-white text-slate-800 border-l-4 border-emerald-500",
  error: "bg-white text-slate-800 border-l-4 border-rose-500",
};

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:justify-end sm:px-6"
    >
      <div
        className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-sm px-4 py-3 shadow-lg ring-1 ring-slate-200 ${styles[toast.kind]}`}
      >
        <p className="text-sm">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="ml-2 -mr-1 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </div>
  );
}
