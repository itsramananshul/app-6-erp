"use client";

export type ConnectionState = "connecting" | "live" | "reconnecting" | "stale";

interface ConnectionStatusProps {
  state: ConnectionState;
}

const config: Record<
  ConnectionState,
  { label: string; dot: string; chip: string; pulse: boolean }
> = {
  connecting: {
    label: "Connecting",
    dot: "bg-slate-400",
    chip: "bg-slate-200 text-slate-700",
    pulse: true,
  },
  live: {
    label: "Live",
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-800",
    pulse: true,
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-800",
    pulse: true,
  },
  stale: {
    label: "Stale",
    dot: "bg-rose-500",
    chip: "bg-rose-100 text-rose-800",
    pulse: false,
  },
};

export function ConnectionStatus({ state }: ConnectionStatusProps) {
  const c = config[state];
  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 rounded-sm px-2 py-0.5 text-xs font-medium ${c.chip}`}
    >
      <span className="relative inline-flex h-2 w-2">
        {c.pulse ? (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${c.dot}`}
          />
        ) : null}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c.dot}`} />
      </span>
      {c.label}
    </span>
  );
}
