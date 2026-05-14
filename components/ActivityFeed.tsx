"use client";

export type ActivityAction =
  | "create"
  | "status_change"
  | "compliance_change"
  | "note_added";

export type ActivityResult = "success" | "failure";

export interface ActivityEntry {
  id: string;
  timestamp: Date;
  action: ActivityAction;
  recordNumber: string;
  title: string;
  detail: string;
  result: ActivityResult;
  message?: string;
}

interface ActivityFeedProps {
  entries: ActivityEntry[];
}

const actionStyles: Record<ActivityAction, string> = {
  create: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  status_change: "bg-blue-50 text-blue-800 ring-blue-300",
  compliance_change: "bg-purple-50 text-purple-800 ring-purple-300",
  note_added: "bg-slate-100 text-slate-700 ring-slate-300",
};

const actionLabels: Record<ActivityAction, string> = {
  create: "create",
  status_change: "status",
  compliance_change: "compliance",
  note_added: "note",
};

const resultStyles: Record<ActivityResult, string> = {
  success: "bg-emerald-50 text-emerald-800 ring-emerald-300",
  failure: "bg-rose-50 text-rose-800 ring-rose-300",
};

function formatTime(ts: Date): string {
  return ts.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <section
      aria-label="Recent activity"
      className="rounded-sm border border-slate-200 bg-white"
    >
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            Recent Activity
          </h2>
          <p className="text-[11px] text-slate-500">
            Local session log. Clears when you reload the page.
          </p>
        </div>
        <span className="rounded-sm border border-slate-300 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-700">
          {entries.length}
        </span>
      </header>

      {entries.length === 0 ? (
        <div className="px-3 py-8 text-center text-xs text-slate-500">
          No activity yet. Create a record or update one to log events.
        </div>
      ) : (
        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
          {entries.map((e) => (
            <li
              key={e.id}
              className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 px-3 py-1.5 text-[13px]"
            >
              <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                {formatTime(e.timestamp)}
              </span>
              <span
                className={`inline-flex rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${actionStyles[e.action]}`}
              >
                {actionLabels[e.action]}
              </span>
              <span className="min-w-0 truncate text-slate-700">
                <span className="font-mono text-[11px] text-slate-500">
                  {e.recordNumber}
                </span>
                <span className="mx-1 text-slate-400">·</span>
                <span className="text-slate-800">{e.title}</span>
                <span className="mx-1 text-slate-400">·</span>
                <span className="text-slate-600">{e.detail}</span>
                {e.result === "failure" && e.message ? (
                  <span className="ml-1 text-[11px] text-rose-700/80">
                    — {e.message}
                  </span>
                ) : null}
              </span>
              <span
                className={`inline-flex rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${resultStyles[e.result]}`}
              >
                {e.result}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
