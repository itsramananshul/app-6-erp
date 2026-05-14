"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClientApiKey } from "@/lib/clientKey";
import type {
  ComplianceStatus,
  ErpRecord,
  NewRecordInput,
  RecordStatus,
} from "@/lib/types";
import {
  ActivityFeed,
  type ActivityAction,
  type ActivityEntry,
} from "./ActivityFeed";
import { ApiKeyManager } from "./ApiKeyManager";
import { ComplianceModal } from "./ComplianceModal";
import { ConnectionStatus, type ConnectionState } from "./ConnectionStatus";
import {
  FilterBar,
  type ComplianceFilter,
  type StatusFilter,
  type TypeFilter,
} from "./FilterBar";
import { NewRecordModal } from "./NewRecordModal";
import { NoteModal } from "./NoteModal";
import { RecordsTable, type RecordActionKind } from "./RecordsTable";
import { StatCard } from "./StatCard";
import { StatusModal } from "./StatusModal";
import { Toast, type ToastState } from "./Toast";

interface DashboardProps {
  instanceName: string;
}

const POLL_INTERVAL_MS = 5000;
const STALE_THRESHOLD_MS = 15000;
const ACTIVITY_MAX = 50;

type ActionModal =
  | { kind: "status"; record: ErpRecord }
  | { kind: "compliance"; record: ErpRecord }
  | { kind: "note"; record: ErpRecord }
  | { kind: "new" }
  | null;

function todayLocalISO(now: Date): string {
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function newActivityId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatCurrency(n: number): string {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function Dashboard({ instanceName }: DashboardProps) {
  const [records, setRecords] = useState<ErpRecord[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [lastSuccessAt, setLastSuccessAt] = useState<Date | null>(null);
  const [lastFetchOk, setLastFetchOk] = useState<boolean>(true);
  const [now, setNow] = useState<Date>(new Date());

  const [toast, setToast] = useState<ToastState | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [apiKeysOpen, setApiKeysOpen] = useState(false);

  const { apiKey, isLoaded: apiKeyLoaded, setApiKey, clearApiKey } =
    useClientApiKey();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [complianceFilter, setComplianceFilter] =
    useState<ComplianceFilter>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [search, setSearch] = useState<string>("");
  const [nonCompliantOnly, setNonCompliantOnly] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!apiKey) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/records", {
        cache: "no-store",
        signal: controller.signal,
        headers: { "x-api-key": apiKey },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      const data: ErpRecord[] = await res.json();
      setRecords(data);
      setLoadError(null);
      setLastFetchOk(true);
      setLastSuccessAt(new Date());
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      setLastFetchOk(false);
      setLoadError(
        err instanceof Error ? err.message : "Failed to load records",
      );
    }
  }, [apiKey]);

  useEffect(() => {
    const tickId = setInterval(() => setNow(new Date()), 1000);
    if (!apiKey) {
      return () => clearInterval(tickId);
    }
    void fetchRecords();
    const pollId = setInterval(() => {
      void fetchRecords();
    }, POLL_INTERVAL_MS);
    return () => {
      clearInterval(pollId);
      clearInterval(tickId);
      abortRef.current?.abort();
    };
  }, [fetchRecords, apiKey]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(id);
  }, [toast]);

  const connectionState: ConnectionState = useMemo(() => {
    if (!lastSuccessAt) return "connecting";
    const age = now.getTime() - lastSuccessAt.getTime();
    if (age > STALE_THRESHOLD_MS) return "stale";
    if (!lastFetchOk) return "reconnecting";
    return "live";
  }, [lastSuccessAt, lastFetchOk, now]);

  const today = useMemo(() => todayLocalISO(now), [now]);

  const stats = useMemo(() => {
    const list = records ?? [];
    const total = list.length;
    const nonCompliant = list.filter(
      (r) => r.compliance_status === "NON_COMPLIANT",
    ).length;
    const overdue = list.filter((r) => r.status === "OVERDUE").length;
    const totalImpact = list.reduce((s, r) => s + r.financial_impact, 0);
    return { total, nonCompliant, overdue, totalImpact };
  }, [records]);

  const filtered = useMemo(() => {
    const list = records ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (
        complianceFilter !== "ALL" &&
        r.compliance_status !== complianceFilter
      )
        return false;
      if (typeFilter !== "ALL" && r.record_type !== typeFilter) return false;
      if (nonCompliantOnly && r.compliance_status !== "NON_COMPLIANT")
        return false;
      if (term) {
        const hay =
          `${r.record_number} ${r.title} ${r.department} ${r.responsible_party}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [
    records,
    statusFilter,
    complianceFilter,
    typeFilter,
    search,
    nonCompliantOnly,
  ]);

  const appendActivity = useCallback((entry: ActivityEntry) => {
    setActivity((prev) => [entry, ...prev].slice(0, ACTIVITY_MAX));
  }, []);

  const handleAction = useCallback(
    (record: ErpRecord, action: RecordActionKind) => {
      setActionError(null);
      setActionModal({ kind: action, record });
    },
    [],
  );

  const handleCloseModal = useCallback(() => {
    if (actionBusy) return;
    setActionModal(null);
    setActionError(null);
  }, [actionBusy]);

  const handleResetFilters = useCallback(() => {
    setStatusFilter("ALL");
    setComplianceFilter("ALL");
    setTypeFilter("ALL");
    setSearch("");
    setNonCompliantOnly(false);
  }, []);

  const submitMutation = useCallback(
    async (params: {
      url: string;
      method: "POST" | "PATCH";
      body: unknown;
      action: ActivityAction;
      recordNumber: string;
      title: string;
      detail: string;
      successMessage: string;
      failurePrefix: string;
    }) => {
      setActionBusy(true);
      setActionError(null);
      if (!apiKey) {
        setActionError("Configure an API key in the 🔑 panel first.");
        setActionBusy(false);
        return;
      }
      try {
        const res = await fetch(params.url, {
          method: params.method,
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify(params.body),
        });
        const body = (await res.json().catch(() => null)) as
          | { success?: boolean; error?: string; record?: ErpRecord }
          | null;
        const ok = res.ok && body?.success === true;
        if (!ok) {
          throw new Error(body?.error ?? `Request failed (HTTP ${res.status})`);
        }

        appendActivity({
          id: newActivityId(),
          timestamp: new Date(),
          action: params.action,
          recordNumber: params.recordNumber,
          title: params.title,
          detail: params.detail,
          result: "success",
        });
        setToast({
          id: Date.now(),
          kind: "success",
          message: params.successMessage,
        });
        setActionModal(null);
        void fetchRecords();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Action failed";
        appendActivity({
          id: newActivityId(),
          timestamp: new Date(),
          action: params.action,
          recordNumber: params.recordNumber,
          title: params.title,
          detail: params.detail,
          result: "failure",
          message,
        });
        setActionError(message);
        setToast({
          id: Date.now(),
          kind: "error",
          message: `${params.failurePrefix}: ${message}`,
        });
      } finally {
        setActionBusy(false);
      }
    },
    [appendActivity, fetchRecords, apiKey],
  );

  const handleStatusSubmit = useCallback(
    (newStatus: RecordStatus) => {
      if (actionModal?.kind !== "status") return;
      const r = actionModal.record;
      void submitMutation({
        url: `/api/records/${r.id}/status`,
        method: "PATCH",
        body: { status: newStatus },
        action: "status_change",
        recordNumber: r.record_number,
        title: r.title,
        detail: `${r.status} → ${newStatus}`,
        successMessage: `${r.record_number} → ${newStatus.replace(/_/g, " ")}`,
        failurePrefix: "Status change failed",
      });
    },
    [actionModal, submitMutation],
  );

  const handleComplianceSubmit = useCallback(
    (newCompliance: ComplianceStatus) => {
      if (actionModal?.kind !== "compliance") return;
      const r = actionModal.record;
      void submitMutation({
        url: `/api/records/${r.id}/compliance`,
        method: "PATCH",
        body: { complianceStatus: newCompliance },
        action: "compliance_change",
        recordNumber: r.record_number,
        title: r.title,
        detail: `${r.compliance_status} → ${newCompliance}`,
        successMessage: `${r.record_number} compliance → ${newCompliance}`,
        failurePrefix: "Compliance change failed",
      });
    },
    [actionModal, submitMutation],
  );

  const handleNoteSubmit = useCallback(
    (note: string) => {
      if (actionModal?.kind !== "note") return;
      const r = actionModal.record;
      void submitMutation({
        url: `/api/records/${r.id}/note`,
        method: "POST",
        body: { note },
        action: "note_added",
        recordNumber: r.record_number,
        title: r.title,
        detail:
          note.length > 50 ? `note: ${note.slice(0, 50)}…` : `note: ${note}`,
        successMessage: `Note added to ${r.record_number}`,
        failurePrefix: "Note failed",
      });
    },
    [actionModal, submitMutation],
  );

  const handleNewRecordSubmit = useCallback(
    (input: NewRecordInput) => {
      void submitMutation({
        url: "/api/records",
        method: "POST",
        body: input,
        action: "create",
        recordNumber: input.record_number,
        title: input.title,
        detail: `${input.record_type} · ${input.department}`,
        successMessage: `Created record ${input.record_number}`,
        failurePrefix: "Create failed",
      });
    },
    [submitMutation],
  );

  const lastRefreshedAgo = useMemo(() => {
    if (!lastSuccessAt) return null;
    return Math.max(
      0,
      Math.floor((now.getTime() - lastSuccessAt.getTime()) / 1000),
    );
  }, [lastSuccessAt, now]);

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-700 bg-slate-800 text-slate-100">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              ERP System
            </h1>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              v3.14 · Module: Compliance &amp; Regulatory
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className="inline-flex items-center gap-2 rounded-sm bg-slate-700 px-2 py-0.5 font-medium text-slate-200"
              title="Set via INSTANCE_NAME env var. Read-only in the UI."
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-3 w-3 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V8a4 4 0 1 1 8 0v3" />
              </svg>
              Instance: {instanceName}
            </span>
            <ConnectionStatus state={connectionState} />
            <button
              type="button"
              onClick={() => setApiKeysOpen(true)}
              className="inline-flex items-center gap-1 rounded-sm bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-100 hover:bg-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <span aria-hidden>🔑</span> API Keys
            </button>
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setActionModal({ kind: "new" });
              }}
              className="inline-flex items-center gap-1 rounded-sm bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              + New record
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
          <span>
            <span className="text-slate-500">Last refreshed:</span>{" "}
            <span className="text-slate-700 tabular-nums">
              {lastSuccessAt ? lastSuccessAt.toLocaleTimeString() : "—"}
            </span>
            {lastRefreshedAgo !== null ? (
              <span className="ml-1 text-slate-500">
                ({lastRefreshedAgo}s ago)
              </span>
            ) : null}
          </span>
          <span className="text-slate-400">·</span>
          <span>
            Polling every {Math.round(POLL_INTERVAL_MS / 1000)} s · stale after{" "}
            {Math.round(STALE_THRESHOLD_MS / 1000)} s
          </span>
        </div>

        <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Records" value={stats.total} />
          <StatCard
            label="Non-Compliant"
            value={stats.nonCompliant}
            tone={stats.nonCompliant > 0 ? "danger" : "default"}
            hint={
              stats.nonCompliant > 0
                ? "Contributes to degraded health"
                : "All compliant"
            }
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            tone={stats.overdue > 0 ? "warning" : "default"}
            hint={
              stats.overdue > 0
                ? "Contributes to degraded health"
                : "Nothing overdue"
            }
          />
          <StatCard
            label="Total Financial Impact"
            value={formatCurrency(stats.totalImpact)}
            tone="success"
            hint="Sum across all records"
          />
        </section>

        {apiKeyLoaded && !apiKey ? (
          <div className="mt-4 rounded-sm border border-amber-300 bg-amber-50 px-3 py-2">
            <p className="text-xs font-semibold text-amber-900">
              🔑 Configure an API key for this dashboard.
            </p>
            <p className="mt-0.5 text-[11px] text-amber-800">
              Open the <button
                type="button"
                onClick={() => setApiKeysOpen(true)}
                className="underline decoration-amber-700/60 underline-offset-2 hover:text-amber-900"
              >
                API Keys
              </button> panel to generate one — or paste an existing key — and
              save it as the active client key.
            </p>
          </div>
        ) : null}

        {apiKey && loadError ? (
          <div className="mt-4 rounded-sm border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-800">
            Failed to load records: {loadError}
          </div>
        ) : null}

        <section className="mt-4">
          <FilterBar
            statusFilter={statusFilter}
            complianceFilter={complianceFilter}
            typeFilter={typeFilter}
            search={search}
            nonCompliantOnly={nonCompliantOnly}
            onStatusChange={setStatusFilter}
            onComplianceChange={setComplianceFilter}
            onTypeChange={setTypeFilter}
            onSearchChange={setSearch}
            onNonCompliantChange={setNonCompliantOnly}
            resultCount={filtered.length}
            totalCount={records?.length ?? 0}
            onReset={handleResetFilters}
          />
        </section>

        <section className="mt-3">
          {!apiKey ? (
            <div className="rounded-sm border border-slate-200 bg-white px-3 py-10 text-center text-xs text-slate-500">
              Waiting for an API key — open the 🔑 panel to configure one.
            </div>
          ) : records === null && !loadError ? (
            <div className="rounded-sm border border-slate-200 bg-white px-3 py-10 text-center text-xs text-slate-500">
              Loading records…
            </div>
          ) : (
            <RecordsTable
              records={filtered}
              today={today}
              onAction={handleAction}
            />
          )}
        </section>

        <section className="mt-5">
          <ActivityFeed entries={activity} />
        </section>
      </main>

      <StatusModal
        open={actionModal?.kind === "status"}
        recordNumber={
          actionModal?.kind === "status"
            ? actionModal.record.record_number
            : ""
        }
        currentStatus={
          actionModal?.kind === "status"
            ? actionModal.record.status
            : "PENDING_REVIEW"
        }
        busy={actionBusy}
        errorMessage={actionError}
        onCancel={handleCloseModal}
        onSubmit={handleStatusSubmit}
      />

      <ComplianceModal
        open={actionModal?.kind === "compliance"}
        recordNumber={
          actionModal?.kind === "compliance"
            ? actionModal.record.record_number
            : ""
        }
        currentStatus={
          actionModal?.kind === "compliance"
            ? actionModal.record.compliance_status
            : "COMPLIANT"
        }
        busy={actionBusy}
        errorMessage={actionError}
        onCancel={handleCloseModal}
        onSubmit={handleComplianceSubmit}
      />

      <NoteModal
        open={actionModal?.kind === "note"}
        recordNumber={
          actionModal?.kind === "note" ? actionModal.record.record_number : ""
        }
        existingNotes={
          actionModal?.kind === "note" ? actionModal.record.notes : ""
        }
        busy={actionBusy}
        errorMessage={actionError}
        onCancel={handleCloseModal}
        onSubmit={handleNoteSubmit}
      />

      <NewRecordModal
        open={actionModal?.kind === "new"}
        busy={actionBusy}
        errorMessage={actionError}
        onCancel={handleCloseModal}
        onSubmit={handleNewRecordSubmit}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />

      <ApiKeyManager
        open={apiKeysOpen}
        onClose={() => setApiKeysOpen(false)}
        currentKey={apiKey}
        onKeySet={setApiKey}
        onKeyCleared={clearApiKey}
      />
    </div>
  );
}
