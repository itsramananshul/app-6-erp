# APP 6 — ERP System

Standalone Next.js 14 + TypeScript app that simulates a legacy enterprise ERP
covering compliance, financial records, and regulatory reporting. Backed by
Supabase Postgres. Same codebase runs as Factory 1–4 and Warehouse 1–2 with
per-instance isolation via the `instance_name` column.

The `/api/status` endpoint reports `health: "degraded"` whenever the instance
has any NON_COMPLIANT or OVERDUE records. That's the signal Nexus will read.

Aesthetic note: this app deliberately looks older and more corporate than
apps 1–5 — light gray page, navy header bar, dense table rows, muted boxy
badges, font-mono record numbers, white stat cards with a colored left
border instead of gradients. "This system has been running since 2008 and
nobody has redesigned it."

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- `@supabase/supabase-js`
- Vercel-ready (no custom port handling)

## Supabase setup

1. Paste `supabase/schema.sql` into the Supabase SQL editor and run (once).
2. Paste `supabase/seed.sql` and run. It upserts 72 rows — 12 per instance.
   Every instance has ≥ 2 NON_COMPLIANT records and at least one OVERDUE
   record, so `/api/status` reports degraded out of the box.

## Environment

`.env.local` (copied from app-1):

```env
INSTANCE_NAME=Factory 1
NEXT_PUBLIC_INSTANCE_NAME=Factory 1

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...   # preferred (bypasses RLS)
SUPABASE_ANON_KEY=...           # fallback
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Switch instance locally by changing `INSTANCE_NAME` and
`NEXT_PUBLIC_INSTANCE_NAME` and restarting `npm run dev`.

## Local dev

```bash
npm install
npm run dev          # http://localhost:3000
```

## API

| Method | Path                                  | Body                                | Notes                                            |
| ------ | ------------------------------------- | ----------------------------------- | ------------------------------------------------ |
| GET    | `/api/records`                        | —                                   | List, sorted by `due_date` ASC                   |
| POST   | `/api/records`                        | new-record fields                   | Creates row in PENDING_REVIEW / UNDER_REVIEW    |
| GET    | `/api/records/[id]`                   | —                                   | Single record                                    |
| PATCH  | `/api/records/[id]/status`            | `{ "status": "..." }`               | APPROVED auto-sets `completed_date = today`     |
| PATCH  | `/api/records/[id]/compliance`        | `{ "complianceStatus": "..." }`     | Change compliance status                         |
| POST   | `/api/records/[id]/note`              | `{ "note": "..." }`                 | Appends timestamped note                         |
| GET    | `/api/status`                         | —                                   | health is `degraded` if `nonCompliantCount > 0` OR `overdueCount > 0` |

All errors → `{ "success": false, "error": "..." }`.
All mutation successes → `{ "success": true, "record": { ... } }`.

## UI

- Navy top bar with "ERP System v3.14 · Module: Compliance & Regulatory",
  instance chip, connection status, and **+ New record** button.
- Four stat cards (flat white, colored left border): Total Records,
  Non-Compliant (danger when > 0), Overdue (warning when > 0), Total
  Financial Impact.
- Filter bar: status, compliance status, type, free-text search, "Non-compliant only" toggle.
- Dense table with zebra striping. NON_COMPLIANT rows get a rose left
  border on the first cell; OVERDUE rows get a soft amber background.
  Past `due_date` for non-APPROVED, non-EXEMPT records highlights in rose.
- Per-row actions: Status / Compliance / Note → modal.
- Toast for every mutation. Bottom **Recent Activity** panel logs the last
  50 attempts client-side.

## Deploy to Vercel

One Vercel project per instance, all pointing at the same git repo with
**Root Directory** = `app-6-erp`. Same Supabase env vars across projects;
only `INSTANCE_NAME` / `NEXT_PUBLIC_INSTANCE_NAME` differ.

## curl smoke test

```bash
BASE=http://localhost:3000

curl $BASE/api/records
curl $BASE/api/status

# Use an id from the list above.
curl -X PATCH $BASE/api/records/<uuid>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED"}'         # auto-sets completed_date to today

curl -X PATCH $BASE/api/records/<uuid>/compliance \
  -H "Content-Type: application/json" \
  -d '{"complianceStatus":"COMPLIANT"}'

curl -X POST $BASE/api/records/<uuid>/note \
  -H "Content-Type: application/json" \
  -d '{"note":"CPA sign-off received"}'

curl -X POST $BASE/api/records \
  -H "Content-Type: application/json" \
  -d '{
    "record_number":"ERP-F1-999",
    "record_type":"COMPLIANCE",
    "title":"Test compliance review",
    "description":"...",
    "department":"Legal",
    "responsible_party":"Demo user",
    "due_date":"2026-08-01",
    "financial_impact":15000,
    "notes":""
  }'

# 400 — bad enum
curl -X PATCH $BASE/api/records/<uuid>/compliance \
  -H "Content-Type: application/json" \
  -d '{"complianceStatus":"NOPE"}'

# 404 — unknown id
curl $BASE/api/records/00000000-0000-0000-0000-000000000000
```
