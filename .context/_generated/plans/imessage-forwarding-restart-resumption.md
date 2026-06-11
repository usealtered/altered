---
name: iMessage forwarding and restart resumption
overview: "Self-contained design for cross-deployment generation handoff, in-process restart resumption, and shared iMessage orchestrator generation pipeline. Covers durable message protocol, disposable background-job state (Redis-first), no-op exit tools, and concurrency edge cases — not coffee demo scaffolding."
todos:
  - id: sdk-message-spike
    content: "Run one multi-step orchestrator generation; log result.response.messages vs steps; validate jsonb round-trip."
    status: pending
  - id: shared-generation-pipeline
    content: "Extract internal runImessageGeneration({ userId, conversationId?, phoneNumber?, threadId? }) used by Chat SDK path and resume/background path."
    status: pending
  - id: thread-context-reconstruction
    content: "Implement userId → phoneNumber → encodeThreadId → chat.thread() helper (inverse of getImessagePhoneNumberByThread)."
    status: pending
  - id: background-job-redis-schema
    content: "Define user-scoped Redis background-job record (scope discriminator, metadata, TTL, consume-on-ingest)."
    status: pending
  - id: noop-exit-tools
    content: "Add forward-generation and restart-generation no-op exit tools; host performs save → side effects after loop ends."
    status: pending
  - id: resume-endpoint
    content: "Implement dedicated resume/background handler (or conditional branch) that validates handoff and runs shared pipeline."
    status: pending
  - id: in-process-restart-loop
    content: "Implement restart loop with preset reason schema, config reload, system continuation message, max 1 restart per inbound message."
    status: pending
  - id: concurrency-source-pending-forward
    content: "Handle source webhook arriving while forward handoff still pending (~15s timeout, fail-fast system message path)."
    status: pending
  - id: chat-lock-manual-path
    content: "Use chat.locks.acquire(threadId) for background generation/send outside Chat SDK webhook; release after completion."
    status: pending
  - id: failure-ladder
    content: "Implement ordered failure handling: Redis validation → runtime snapshot → system correction → orchestrator user reply."
    status: pending
  - id: optional-metadata-columns
    content: "Decide whether toolCallId / providerMessageId columns are needed after spike; defer generationRunId unless durability case wins."
    status: pending
  - id: merge-admin-forwarding
    content: "Retire admin-immediate-tasks pre-Chat-SDK lane; fold forwarding prefs into orchestrator tools (post coffee-demo patterns)."
    status: pending
isProject: false
---

# Forwarding and restart resumption plan

> **Purpose:** Standalone reference for implementing iMessage orchestrator resumption. No chat history required beyond this document.

Last updated: 2026-06-05 (incorporates resume-transport, Redis handoff shape, post-generation save, concurrency, and restart schema refinements).

---

## Outcome

Ship a reliable resumption model for two cases:

1. **In-process restart** — model/config/preference change mid-turn on the **same deployment**.
2. **Cross-deployment forward** — production → preview/development, then continue generation on **target**.

Both must:

- Preserve conversational semantics in Postgres (`ModelMessage`-compatible rows).
- Avoid optimistic history that claims cross-deploy success before target confirms receipt.
- Use disposable **background job state** (Redis-first) as a **validation gate and dedupe aid**, not the source of conversational truth.
- Keep webhook ingress provider-safe (`200 OK` outward).
- Share one **internal generation workflow** whether ingress is Sendblue webhook, resume endpoint, or future background jobs.

## Non-scope

- Coffee demo agent structure, tool definitions, or ToolLoopAgent placeholder props (use as infra spike only).
- Orchestrator module layout finalization (patterns here apply regardless).
- Chat SDK thread iterator as canonical history (Postgres remains canonical).
- Effect migration (noted as future hardening for retries, KV, HTTP).
- `confirm-environment` tool (explicitly rejected — see Resolved decisions).

---

## Architectural context (settled over prior discussions)

### Orchestrator model

- **Single intelligent orchestrator** for all iMessage interpretation and replies.
- **Same competent model** for tool routing and user-facing text (no cheap-orchestrator + expensive-responder split).
- **Full conversation history** at generation time for now (load all messages from DB; later: composed memory layer + caching).
- Rejected long-term: mini routing model as primary gate, `/dev` slash commands, separate immediate-task lane outside Chat SDK as final architecture.

### Tool vs subagent boundaries

- **Tool calls over subagents** for in-turn actions: forward, restart, config updates, admin prefs.
- **Subagents** reserved for separate *processes* (research, long jobs) — e.g. coffee research subagent-as-tool pattern.
- Pattern name: **"intent tool + host executor"** — tool records intent and exits loop via no-op; host performs Redis, HTTP, iMessage send **after** generation ends.

### Ingress evolution (temporary → target)

| Layer | Current / temporary | Target |
|-------|---------------------|--------|
| Transport gates | `process.ts`: admin forward prefs, raw Sendblue forward to preview | Keep transport gates only (auth, dedupe, forward transport) |
| Pre-Chat-SDK handlers | `admin-immediate-tasks.ts`, coffee demo ingest in `handle/designated.ts` | Fold into orchestrator tools |
| Generation | `buildDirectMessageResponse` (simple generate, no tools yet) | Shared orchestrator pipeline with ToolLoopAgent |

**3-layer ingress** (transport → designated steps → Chat SDK) is acceptable as **temporary scaffold** while coffee demo and forwarding are interleaved. End state: one orchestrator inside Chat SDK direct-message path (or shared pipeline called from it).

### Current code landmarks

| Concern | Path |
|---------|------|
| Webhook ingress | `packages/server-experimental/src/chat/providers/imessage/webhook/process.ts` |
| Sendblue → Chat SDK | `chat.webhooks.sendblue` in `process.ts:48-49`, then `events/direct-message/build-response.ts` |
| Designated / dev path | `webhook/handle/designated.ts` → coffee demo → Chat SDK |
| Thread decode (phone from thread) | `get-phone-number-by-thread.ts` — `adapter.decodeThreadId(id).contactNumber` |
| Thread encode (phone → thread) | `respond-from-raw.ts` — `adapter.encodeThreadId({ fromNumber, contactNumber })` |
| Admin forwarding KV | `webhook/forwarding/preference.ts` — key `chat:imessage:admin:webhook-forwarding-target:{phoneNumber}` |
| Raw webhook forward | `webhook/forwarding/index.ts` — `x-altered-forwarded-request`, `x-altered-forwarded-target` |
| Message schema | `chat/messages/schema.ts` — `content` already **jsonb** as `ModelMessage["content"]` |

### Known wiring flaws (fix during implementation, not blocking design)

- `processSendblueWebhook({ request, options })` signature vs positional call in `api-experimental/routers/webhooks/sendblue.ts`.
- Model id imports disconnected (`app.ts` stripped; catalog in `config/ai.ts`).
- Coffee demo bugs: wrong tool mapping in `tools/set.ts`, bad import in `research-coffee-options.ts`, `run.ts` status detection.
- Staged/unstaged split interleaves coffee + forwarding work.

---

## Database schema (content storage)

### Current state

`chat_messages.content` is already **`jsonb`** typed as `ModelMessage["content"]`, with `role` as a separate column. **No migration needed for content type.**

Supported shapes:

- `user`: `string | ContentPart[]`
- `assistant`: `string | (TextPart | ToolCallPart | ...)[]`
- `tool`: `ToolResultPart[]`
- `system`: `string`

### Optional metadata columns (after SDK spike — not blocking coffee work)

| Column | Purpose | Priority |
|--------|---------|----------|
| `providerMessageId` | Sendblue dedupe | Medium |
| `toolCallId` | Upsert/dedupe tool rows on replay | Medium |
| `generationRunId` | Group rows from one inbound webhook run | **Deferred / questionable** — see §7 below |

Do **not** store full `StepResult` JSON in `content`. Do **not** collapse assistant tool-call + tool-result into one row.

### Validation at write time

Use AI SDK `modelMessageSchema` (or role-specific schemas) before insert during spike. Fail loud in dev if SDK emits a shape we cannot round-trip.

---

## AI SDK persistence semantics

From AI SDK v6 `ToolLoopAgent` / `generateText`:

| Artifact | Purpose | Persist? |
|----------|---------|----------|
| `result.response.messages` | Canonical assistant + tool `ModelMessage` deltas for the full run | **Yes** — primary append target |
| `result.steps[]` | Per-step diagnostics | **No** as primary history — logging/metrics only |
| `result.content` | Flattened parts | **No** for history — outbound text extraction only |

**Resume rule:** No SDK "resume from StepResult" API. Continuation = pass accumulated `ModelMessage[]` into next `agent.generate({ messages })`.

**Subagent handoff:** Subagent receives `messages` (history including orchestrator tool results). Subagent output returns as parent tool result; parent persists before next orchestrator step (when using multi-step persist — see save strategy below).

---

## Durable message protocol

### Rows we store

- `user` — inbound provider message (existing).
- `assistant` — may include text + tool-call parts in one message (multi-part jsonb).
- `tool` — tool results keyed by `toolCallId`.
- `system` — programmatic injections (restart ack, forward success on target, forward failure on source, mismatch correction).

### What we do not store as standalone rows

- Ephemeral runtime snapshot (injected per request, not durable).
- Raw `StepResult` blobs.
- Provider webhook payload duplicates beyond normalized user message.

---

## Ephemeral runtime snapshot (per generation)

Inject alongside system instructions (not stored as user-visible history):

```
RUNTIME_ENV:
- appTarget: api | api-experimental
- configEnv: production | preview | development
- modelId: anthropic/claude-sonnet-4.6
- forwardingTarget: none | preview-development
```

Purpose: mismatch guardrail when history is stale. History is authoritative for *what was attempted*; snapshot for *what is true now*.

For restart with config diff, ephemeral may also include `from` / `to` blocks so the model can answer "what changed?" without extra tool.

---

## Shared internal generation pipeline

Both ingress paths should converge on one internal function (name TBD), conceptually:

```ts
runImessageGeneration({
  userId: string
  conversationId?: string
  phoneNumber?: string
  threadId?: string
  mode: "webhook" | "resume" | "background"
  handoff?: BackgroundJobRecord
})
```

### Context reconstruction (without Sendblue payload)

Starting inputs: **`userId`** (+ optional `conversationId`, `phoneNumber`).

1. Resolve `phoneNumber` from `userId` if not provided (user profile / admin mapping — implementation TBD).
2. Resolve `fromNumber` (Sendblue bot number) from environment config.
3. **Encode thread id:** `adapter.encodeThreadId({ fromNumber, contactNumber: phoneNumber })` — inverse of `getImessagePhoneNumberByThread`.
4. `chat = getAlteredChat()` → `thread = chat.thread(threadId)`.
5. Load or create conversation via `getOrCreateActiveConversationForThread({ chatProvider: "sendblue", threadId })`.
6. Load history, compose prompts, run orchestrator, persist, send via `thread.post`.

This enables resume/background jobs **without** replaying Sendblue webhook body as a new conversational turn.

### What `process.ts` / Chat SDK path actually does today

- `chat.webhooks.sendblue` verifies Sendblue signature and routes to registered direct-message handler.
- Handler calls `buildDirectMessageResponse({ thread, message })` which already has `thread` + saves user message + generates + posts reply.
- **Refactor target:** replace inline generate in `buildDirectMessageResponse` with shared `runImessageGeneration`, passing context derived from `thread.id`.

### Dedicated resume endpoint vs conditional branch on existing webhook

| Option | Pros | Cons |
|--------|------|------|
| **Separate `POST /internal/.../generation-resume`** | Clear semantics; works for background jobs, scheduled sends, non-webhook triggers | Extra route + auth |
| **Same Sendblue route + header/condition** | Less routing reconstruction at HTTP layer | Mixed concerns in one handler |

**Leaning decision:** Shared **internal workflow** is mandatory either way. Separate endpoint is **preferred for semantics** and demonstrates background execution without incoming webhook — but reusing the existing route with a header (`x-altered-resume-handoff-id` or similar) is acceptable if it avoids duplicate HTTP wiring.

Raw Sendblue forward (`forwardSendblueWebhook`) remains valid for **provider ingress testing** on preview, but **not** for generation resume (would re-ingest as new user turn).

---

## Background job state (Redis vs DB)

**Conceptual reframe:** Handoff is not "forwarding-only" — it is **background job state** reusable for:

- Cross-deployment generation resume
- Deduping forwarded/retry requests
- Future scheduled message sends, long-running job continuation

### Storage choice — **UNRESOLVED**

| Store | Pros | Cons |
|-------|------|------|
| **Redis (Upstash)** | Fast TTL, atomic consume, disposable by design | Not durable across long outages |
| **Postgres** | Durable, queryable | Heavier; overlaps with message history; cleanup needed |

**Working assumption:** Redis for MVP disposable handoff. Revisit DB if we need multi-hour durable job state or audit trail.

### Redis key pattern (user-scoped, fail-fast)

**Key:**

```
application-target-forwarding-handoff:user-id-{userId}:id-{nanoId}
```

**Rationale:**

- User-scoped prefix allows querying a **minimal set** of pending jobs per user (SCAN/MATCH on prefix) rather than global search.
- `nanoId` suffix is the handoff id passed to resume endpoint.
- Narrow scope + explicit metadata → **fail fast** if no exact match.

**Payload (example):**

```json
{
  "scope": "chat:imessage:response",
  "status": "pending | dispatched | consumed | failed",
  "createdAt": "ISO-8601",
  "metadata": {
    "conversationId": "...",
    "latestMessageId": "...",
    "historyHash": "...",
    "userId": "...",
    "phoneNumber": "...",
    "threadId": "...",
    "requiredHeaderTarget": "preview-development",
    "source": { "appTarget": "api", "environment": "production" },
    "target": { "appTarget": "api-experimental", "environment": "preview" }
  }
}
```

### Scope discriminator

`scope` values (extensible, typesafe):

| Scope | Use |
|-------|-----|
| `chat:imessage:response` | Cross-deploy forward + iMessage reply on target |
| (future) `chat:imessage:background-send` | Scheduled outbound without inbound webhook |
| (future) `job:*` | Non-chat background work |

Scope drives validation rules, failure messages, and which host executor runs after consume.

### Correlation: conversation vs thread vs handoff id

Handoff spans **generation continuation** and **iMessage response delivery** — correlation is inherently multi-dimensional.

**Safest approach (user decision):** Metadata carries **`conversationId` + `latestMessageId` or `historyHash`** for exact match validation. Redis key is **user-scoped + nanoId**, not conversationId alone (avoids stale key after `/new` without clearing).

**On `/new` conversation:** Invalidate or fail-fast any pending handoff whose `metadata.conversationId` no longer matches active thread anchor.

**TTL:** ~15 minutes max; expect consume within seconds. Align TTL mindset with pending-forward timeout below.

---

## Save strategy — post-generation (no-op exit)

**Supersedes earlier per-step `onStepFinish` recommendation.**

Because forward and restart both use a **no-op exit tool** to end the agent loop cleanly:

1. Orchestrator runs tool loop until **no-op exit** (forward/restart intent already recorded in tool calls/results in memory).
2. **After loop ends:** persist full `result.response.messages` batch to Postgres (assistant tool-call parts, tool results, any assistant text from the run).
3. **Then** host executor runs side effects:
   - **Forward:** write Redis handoff → dispatch resume POST → (success handled on target).
   - **Restart:** reload config → append system message → regenerate (same deployment).

**Why not per-step save for MVP forward/restart:**

- Simpler; no step-state reconciliation.
- Forward/restart intentionally exit before final user-facing assistant text on source.
- Crash between loop end and save is acceptable short window if we add retry/idempotency later.

**When per-step save may return:** Long multi-tool turns where crash mid-run must preserve partial tool history before forward — revisit if orchestrator loops grow beyond forward/restart MVP.

**Spike still required:** Confirm `result.response.messages` contains complete tool-call + tool-result pairs for a multi-step run before relying on end-of-run flush.

---

## No-op exit tools

Two primary intent tools (or one tool with `action` enum):

### `forward-generation`

- Tool `execute` returns structured intent `{ action: "forward", target: "preview-development" }` — **no HTTP inside execute**.
- Agent instructions: after calling forward tool, call **`done` / no-op exit tool** to stop loop.
- Host after save: Redis handoff + resume dispatch.

### `restart-generation`

- Tool `execute` returns structured intent with preset reason (see schema below).
- No-op exit → save → host applies config → system message → regenerate.

**Do not** mutate tool-result rows from `pending` to `success` in place. Success/failure for cross-deploy is signaled by **append-only system messages** (and Redis status for transport).

---

## Restart tool schema

Keep input **simple** — preset id maps to injected system message:

```ts
{
  reason: "configuration-update"  // preset enum, extensible
  from?: { modelId?: string; forwardingTarget?: string; /* ... */ }
  to?: { modelId?: string; forwardingTarget?: string; /* ... */ }
}
```

**Preset → system message mapping (example):**

| `reason` | System message (approx) |
|----------|-------------------------|
| `configuration-update` | "The model configuration was updated. Continue from the last user message." |

`from` / `to` in tool result and/or ephemeral prompt enable answering "what config options were changed?" without a separate tool.

**Constraints:**

- Max **1 restart per inbound user message**.
- All prior tool history **kept** (append system, do not strip assistant tool calls).

---

## Case A — In-process restart (same deployment)

Trigger: orchestrator calls `restart-generation` → no-op exit.

Sequence:

1. Agent loop ends; persist `result.response.messages` (includes restart tool-call + result).
2. Host reads restart intent from tool result.
3. Host applies config changes (model id, forwarding target KV, etc.).
4. Append **system** message (from preset + optional diff summary).
5. Call `agent.generate({ messages: persistedHistory })` — **same user turn**, no new user row.
6. Persist second run messages; send final assistant text via `thread.post`.
7. Abort if restart count > 1 for this inbound message.

No Redis required for pure in-process restart (unless we want dedupe — optional).

---

## Case B — Cross-deployment forward + resume

### Source deployment sequence

1. Orchestrator calls `forward-generation` intent tool → no-op exit.
2. Persist full run messages to Postgres (tool-call + tool-result with forward intent; status may be noted in tool result JSON as `"pending"` but transport truth is Redis).
3. Write Redis background job (`scope: chat:imessage:response`, `status: pending`).
4. Host dispatches `POST` to target **resume endpoint** with `{ handoffId: nanoId, userId, ... }` + forward headers (`x-altered-forwarded-target`, etc.).
5. **No further model generation on source** for this turn (no user-facing assistant text on source on success path).
6. On **dispatch failure:** mark Redis `failed`; append **system** message on source: *"Failed to forward the webhook target. Respond to the user's latest message accordingly."* → run orchestrator on source → send reply (**full meal deal**, not silent console.error only).

Optional: short status bubble ("Forwarding to preview…") if dispatch may exceed ~2s — low priority.

### Target deployment sequence

1. Resume handler receives `handoffId` (+ headers).
2. Load Redis record by user-scoped key + id; validate `scope`, `requiredHeaderTarget`, app target, `metadata.conversationId` / hash.
3. **Atomic consume:** delete key or CAS to `consumed` **immediately on ingest** (before long generation).
4. Reconstruct thread context from metadata (`userId` → phone → thread).
5. **`chat.locks.acquire(threadId)`** — manual lock for out-of-webhook path (Chat SDK webhook path acquires automatically).
6. Load Postgres history for `conversationId`; verify hash / latest message id matches metadata (**fail fast** if mismatch).
7. Append **system success message only now** (after validation): e.g. *"Request forwarded successfully from production. Continue from the latest user message."*
8. Run shared orchestrator generation; persist; `thread.post` reply.
9. Release lock.

### System success message timing

**Decision:** Write system success message **only on target after successful handoff validation** — not on source before transport completes. Avoids history claiming success when preview never ran.

---

## Concurrency and edge cases

### Chat SDK locks vs Redis handoff

| Mechanism | Role |
|-----------|------|
| **`chat.locks.acquire(threadId)`** | Primary concurrency for manual/background generation + send outside `onDirectMessage` |
| **Redis handoff** | Validation gate, dedupe, edge-case peace of mind — **not** primary concurrency control |

Chat SDK handles message concurrency better than custom logic for normal webhook ingress. Manual acquire/release required on resume/background endpoint.

### Source webhook arrives while forward still pending

Scenario: User message forwarded to preview; Redis key still exists; **another** inbound webhook hits **source** before target consumes handoff (or forward stuck).

**Starter policy (acknowledged rough):**

1. Before processing new inbound on source, check for pending handoff for same user/conversation.
2. If pending and **elapsed < ~15s:** wait briefly / defer / retry (exact behavior **UNRESOLVED** — may block webhook handler briefly or return 200 and schedule `waitUntil` retry).
3. If pending and **elapsed ≥ ~15s:** treat forward as **failed** → append system failure message → generate on source → send.
4. When target consumes handoff, Redis key removed **immediately** — subsequent source messages proceed normally.

**Duplicate resume POST:** Idempotent consume — second POST finds no key → `200 OK`, no double generation.

### Normal Sendblue webhook on target during pending handoff

If raw forwarded Sendblue webhook hits target while resume handoff pending for same conversation:

- Prefer **no duplicate generation** from raw webhook path when resume will handle it.
- Options: skip Chat SDK generate when matching pending/consumed handoff exists, or rely on resume-only path exclusively for continued generation (**UNRESOLVED** wiring detail).

### Retry forwarding

When adding HTTP retries for `forwardSendblueWebhook` / resume dispatch:

- Same `handoffId` + idempotent consume prevents double execution on target.
- Redis `status: dispatched` may help distinguish in-flight vs fresh — **UNRESOLVED**.

---

## Failure ladder (ordered)

1. **Redis / handoff validation** (hard gate on resume — fail fast, log, no generation).
2. **Ephemeral `RUNTIME_ENV` snapshot** (soft guard in system prompt on mismatch).
3. **Programmatic system correction message** (append-only history).
4. ~~**`confirm-environment` tool**~~ — **rejected**; snapshot + Redis + system messages sufficient.
5. **Orchestrator-generated user reply** on failure paths (source regen after forward failure system message).

---

## Resolved decisions (latest)

| # | Topic | Decision |
|---|-------|----------|
| 1 | Resume transport | Dedicated resume handler starting from `userId` (+ optional ids); shared internal pipeline with webhook path. Raw Sendblue replay **not** for generation resume. |
| 2 | Handoff storage shape | User-scoped Redis key + nanoId; payload with `scope` + rich `metadata`; fail-fast exact match. Redis vs DB for durable jobs **still open**. |
| 3 | Save timing | **Post-generation flush** after no-op exit — not per-step `onStepFinish` for MVP forward/restart. |
| 4 | Forward success in history | System message on **target only after successful ingest**; no in-place tool row updates. |
| 5 | Failed forward UX | System error on source + orchestrator regen + iMessage send (not silent fail). |
| 6 | Locks | `chat.locks.acquire(threadId)` on manual/background path; release after handling. |
| 7 | `generationRunId` column | **Deferred** — see open question below. |
| 8 | Forward/restart implementation | Intent tool + no-op exit + host executor. |
| 9 | Restart schema | Preset `reason` (e.g. `configuration-update`) + optional `from`/`to`. |
| 10 | `confirm-environment` | **Not needed.** |
| 11 | Orchestrator tier | Single intelligent model with full history (settled). |

---

## Open questions — needs your resolution

### 1. Redis vs Postgres for background job state

Redis assumed for disposable handoff. Do you want any handoff fields mirrored to Postgres for audit/debug, or strictly Redis until a job lasts >15 minutes?

### 2. Separate resume endpoint vs header on existing webhook

Shared internal workflow is settled. Confirm preference:

- **A)** New internal route (e.g. `POST /internal/chat/imessage/generation-resume`)
- **B)** Conditional branch on existing Sendblue webhook route
- **C)** Both wrappers calling same function (resume route primary; webhook branch for expedience)

### 3. Source concurrency while forward pending (<15s)

When new inbound hits source and handoff still pending under timeout:

- **Wait** inside handler (blocks webhook response)?
- **`waitUntil` deferred retry** (returns 200 immediately)?
- **Fail open** (process message on source in parallel — likely bad)?

### 4. Target behavior for raw forwarded Sendblue during pending resume

Should `process.ts` / designated handler suppress Chat SDK generation when a matching handoff exists, or is resume endpoint the only generation entry on target during forward flows?

### 5. `generationRunId` — use case elaboration

**Why it was proposed:**

- Group all DB rows written from one inbound webhook agent run (debug: "which messages came from which generation").
- Idempotent replays if Sendblue retries webhook (detect already-persisted run).
- Reconcile partial failures (crash after some saves).

**Why you may skip it:**

- Forward handoff is **disposable Redis state** — once consumed, no durable run id needed for cross-deploy.
- In-process restart is same webhook invocation — can use in-memory counter.
- Nullable column adds migration + plumbing for uncertain benefit at current scale.

**Recommendation:** Skip for forward/restart MVP. Revisit only if webhook retry dedupe or multi-step per-step save forces grouping. **`toolCallId` + `providerMessageId` more likely useful first.**

### 6. `historyHash` vs `latestMessageId` in handoff metadata

Which is the canonical alignment check on target?

- **latestMessageId** — simple, one row lookup.
- **hash of tail messages** — catches more drift, slightly more work.

### 7. Optional in-flight status message

Send "Forwarding to preview…" before dispatch if latency >2s? Default **no** unless you want it.

---

## Verification checklist

1. Forward tool → no-op exit → messages saved → Redis written → resume on target → system success → orchestrator completes → iMessage sent on target.
2. Dispatch fails → Redis failed → system message on source → orchestrator regen → user gets reply on source.
3. Duplicate resume POST → handoff consumed → idempotent 200, no double generation.
4. In-process restart → config reload → system message → regen → max 1 restart → no duplicate side effects.
5. Pending forward >15s + new source message → failure system message → source generation.
6. SDK message shapes round-trip: DB jsonb → model messages without cast hacks.
7. `/new` conversation → stale handoff fails validation on target.
8. Manual path acquires/releases `chat.locks` around generation + post.

---

## Execution order

1. **SDK spike** — log `response.messages`; validate jsonb round-trip; decide optional columns.
2. **Thread context helper** — userId → phone → encodeThreadId → thread.
3. **Shared `runImessageGeneration` pipeline** — refactor from `buildDirectMessageResponse`.
4. **No-op exit tools + host executor** — restart loop first (same deploy, simpler).
5. **Redis background job module** — schema, consume, user-scoped keys, scope types.
6. **Resume endpoint** (or conditional branch) + manual locks.
7. **Forward tool + dispatch** + source failure path + pending-forward concurrency stub.
8. **Merge admin forwarding** into orchestrator tools; retire `admin-immediate-tasks.ts` pre-Chat-SDK lane.
9. Failure ladder hardening + idempotency tests.

---

## Related plans

- `.context/_generated/plans/imessage-server-poc.md` — POC vertical
- `.context/_generated/plans/vercel-preview-promotion-api-experimental.md` — preview URL / api-experimental
- `.context/_generated/plans/chat-sdk-history-sendblue-adapter-resolution.md` — adapter thread encoding

---

## Admin forwarding (interim, pre-orchestrator)

Current production admin flow (to be replaced by orchestrator tools):

- Admin phone gated in `checkPermissionToForwardWebhook`.
- Natural-language classification in `admin-immediate-tasks.ts` (cheap model) → KV preference via `setWebhookForwardingTargetPreference`.
- Production forwards raw Sendblue to `SHARED_PROVIDER_PREVIEW_API_URL` with forward headers.
- Preview/dev runs `handleDesignatedWebhook` when `isDevelopment() || isForwardedWebhook`.

**Target:** Admin messages flow through orchestrator like any user message; forwarding preference changes via orchestrator tool; confirmation via model reply in history (ephemeral command messages ideally not persisted — separate concern).
