# Chat SDK + Sendblue adapter resolution, owned history, and AI bridge

This document is the **detailed execution plan** for everything that sits **around** the thin iMessage POC scaffold: fixing Sendblue semantics in a **forked adapter**, wiring **explicit read receipts** and **correct handler routing** in ALTERED, owning **Postgres + Drizzle** message history (not Chat SDK list tables as source of truth), and **bridging** that history into **AI SDK v6** / **Language Model Specification V3** chat types. It **extends** the steps implied by `[imessage-server-poc.md](file:///Users/inducingchaos/Workspace/containers/altered-4200/.context/_generated/plans/imessage-server-poc.md)` without replacing the monorepo rules in `[monorepo-architecture.md](file:///Users/inducingchaos/Workspace/containers/altered-4200/.context/_generated/plans/monorepo-architecture.md)`.

**Canonical monorepo rules** remain in `monorepo-architecture.md`. **Product context** remains in `.context/PRODUCT.md` and `.context/CURRENT.md`.

---

## 1. Purpose and scope

### 1.1 What this plan covers

1. **Forked `chat-adapter-sendblue`** — behavioral fixes (`isDM`, `isMention`, optional **no implicit read receipts**, HTTP vs official SDK consolidation, typed surface for read receipts).
2. `**@altered/server-experimental` and `@altered/api-experimental`** — consumer-side wiring: **handler routing** (1:1 → `onDirectMessage`; groups → mention / subscribe patterns as needed), **explicit** `markRead` / read-receipt calls from handlers or a thin orchestration layer, **git dependency** on the fork until upstream merges.
3. **Owned history** — Drizzle schemas and data access **inside `server-experimental`** under the chat feature tree; **Nanoid** primary keys; `**external_id`** for platform handles (dedupe, backfill); **no MDAST column in v1**; `**content`** (or equivalent) as plain text for now.
4. **AI bridge** — small converter from **our** persisted rows → **AI SDK v6** / LMS V3 **chat** message shapes so model calls stay decoupled from Chat SDK storage.
5. **Redis** — keep `**@chat-adapter/state-redis`** for Chat SDK **state only** (subscriptions, dedupe, locks, thread state JSON, etc.). **Do not** treat Chat SDK’s optional **message history cache** (`msg-history:*` / `chat_state_lists` when using Postgres state) as ALTERED’s source of truth; optional later patch to disable wasted writes is **out of band** until it hurts.

### 1.2 What this plan explicitly defers

- **Forking the core `chat` package** for iterator behavior, `refresh()` limits, or “platform vs cache” ordering — **not required** for the current slice if we **never use** `thread.messages` / `thread.allMessages` / heavy `refresh()` for truth (see §7).
- **Normalized replacement of `chat_state_lists`** inside `@chat-adapter/state-pg` — irrelevant while ALTERED uses **Redis** state for Chat SDK.
- **Sendblue message edits/deletes** as product features — provider does not support true edit/unsend semantics; **our** table can still store **metadata edits** for app logic later without mapping to iMessage edits.

### 1.3 Locked decisions (from review)


| Decision             | Choice                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Adapter distribution | **Git dependency** on our fork until upstream merges                                                                                                                                                                                                                                 |
| Drizzle location     | `**@altered/server-experimental` only** for now: `database/connection.ts` (or similar), feature folders `chat/tables` or `chat/storage` / `chat/conversations`, `chat/messages`, etc.; **relations / merge schema** imported into the package `db` folder for Drizzle initialization |
| Primary keys         | **Nanoid** for all first-class rows                                                                                                                                                                                                                                                  |
| Platform ids         | `**external_id`** (nullable where needed); e.g. Sendblue `**message_handle`** when present                                                                                                                                                                                           |
| Handler intent       | **1:1 iMessage** → `**onDirectMessage`** only; `**onNewMention` / `onSubscribedMessage`** reserved for **groups** (and similar), unless verification proves the core SDK leaves a gap                                                                                                |
| DM + `subscribe()`   | **Prefer no `subscribe()` for DMs** once `adapter.isDM` + routing are correct; **verify mid-fix** and only use a subscribed handler if the shipped `**chat`** dispatch still requires it                                                                                             |
| POC ordering         | **Adapter + routing + explicit read receipts** → **AI reply POC** → **Drizzle history + AI bridge**; **separate commits** per logical chunk                                                                                                                                          |
| Plan filename        | This file: `**chat-sdk-history-sendblue-adapter-resolution.md`**                                                                                                                                                                                                                     |


---

## 2. Background: why the stock adapter feels wrong

This section exists so future readers do not re-litigate the same bugs.

### 2.1 `adapter.isDM` vs `thread.isDM`

The Chat SDK’s `**dispatchToHandlers`** computes:

`const isDM = adapter.isDM?.(threadId) ?? false`

It does **not** use `fetchThread()`’s `isDM` metadata for routing. The Sendblue adapter today implements `**fetchThread`** with `isDM: !decoded.groupId` but **does not** implement `**isDM(threadId)`** on the adapter class. Result: **every 1:1 thread is treated as non-DM** for routing, so `**onDirectMessage` never runs** unless something else changes.

**Fix (fork):** implement `**isDM(threadId): boolean`** consistent with `**!decodeThreadId(threadId).groupId`** (and document edge cases such as missing numbers).

### 2.2 `isMention` overload

Sendblue `**parseMessage`** sets `**isMention: !raw.is_outbound**`, so **every inbound** message is a “mention.” The dispatcher then does `**message.isMention = message.isMention || this.detectMention(...)`** — because `isMention` is already **true**, **text-based @ detection never matters**.

**Fix (fork):** set `**isMention`** only when it is a **real** mention per Chat SDK rules (typically `**detectMention`** / `@userName`), or default `**false`** for inbound and let the core merge set it from text. **Do not** use `isMention` as a synonym for “inbound.”

### 2.3 Groups vs DMs (routing after fixes)

After `**isDM`** is correct:

- **DM:** first branch that matches should be `**onDirectMessage`** (when handlers are registered). Product intent: **all 1:1 traffic** uses `**onDirectMessage`**; **no `subscribe()`** for normal DM operation.
- **Group:** `**isDM` false**; **subscribe + `onSubscribedMessage`** remains the right model for “keep listening in this thread” after opt-in. `**onNewMention**` should align with **actual @ mentions** (or platform-specific mention signals), not “every message.”

**Verification protocol (mid-fix):** add temporary logging (or a single integration test against **mock adapter** if we introduce one) to confirm: **first and subsequent** DM messages hit `**onDirectMessage`** without calling `**thread.subscribe()`**. If the stock `**chat`** package still forces a subscription path for some edge case, document it and use the **minimal** workaround (e.g. subscribe only for groups, or a one-line SDK patch proposal).

### 2.4 Read receipts today

The adapter calls `**markRead(threadId)`** inside `**processInboundMessage`** before `**chat.processMessage`**, via Sendblue `**POST /api/mark-read**`. That is **implicit** and **not** coordinated with app policy (e.g. “only mark read after we reply”, “never mark read”, etc.).

**Fix direction:** remove **automatic** mark-read from inbound processing; expose `**markRead`** / `**sendReadReceipt`** on the adapter instance so the app calls it **explicitly** (see §4).

### 2.5 Chat SDK message iterators vs owned history

`**thread.messages` / `thread.allMessages` / `thread.refresh()`** prefer **adapter `fetchMessages`** (Sendblue **platform list API**) and only **fall back** to `**MessageHistoryCache`** when the platform returns nothing. Iterators can **paginate until exhaustion** — expensive for huge threads. **ALTERED’s** source of truth for LLM context should be **our Drizzle queries**, not these iterators, unless we explicitly want platform backfill (§7).

---

## 3. Fork strategy and repository layout

### 3.1 Fork ownership

- Fork `**chat-adapter-sendblue`** (exact upstream repo name per npm) into **our GitHub org/user**.
- **Branch naming:** e.g. `altered/isdm-mention-read-receipt` — keep **one branch** that accumulates ALTERED-facing fixes until we split upstream PRs.

### 3.2 Consume from `altered-4200`

- Add dependency via **git URL + semver ref** (branch or tag), e.g. in `**pnpm-workspace.yaml` catalog** or package `**package.json`**:
`"chat-adapter-sendblue": "github:ORG/chat-adapter-sendblue#COMMIT_OR_BRANCH"`
- **Pin** to a **commit SHA** once stable for reproducible builds; float branch only during active iteration if preferred.

### 3.3 Upstream PR discipline

Split concerns for upstream friendliness:

1. `**isDM` + `isMention` semantics** — behavioral, high value, easy to review.
2. **Optional `markRead` behavior** — either **config flag** `markReadOnInbound?: boolean` defaulting to **current** behavior for backward compatibility, or **remove** implicit call and document **breaking change** — **decide per upstream tolerance** (prefer **default off** or **opt-in explicit** if we want ALTERED semantics).

---

## 4. Sendblue adapter: concrete change checklist

### 4.1 Implement `isDM(threadId: string): boolean`

- **Implementation:** derive from `**decodeThreadId`**: DM iff **no `groupId`** (and document **contact** vs **group** encoding).
- **Tests:** unit tests for thread id strings: 1:1 vs group vs malformed.

### 4.2 Fix `parseMessage` → `isMention`

- **Remove** `isMention: !raw.is_outbound`.
- **Preferred:** omit `**isMention`** in `Message` constructor or set `**false`** for inbound; let `**chat.processMessage`** set `**message.isMention**` via `**detectMention**`.
- **Group-specific:** if Sendblue later exposes explicit mention payloads, map those to `**true`**; until then, rely on **@ bot username** in text for “mention” routing.

### 4.3 Read receipts: stop implicit, expose explicit

- **Remove** (or gate behind `**false`** default) the `**this.markRead(threadId).catch(...)`** call at the start of `**processInboundMessage`**.
- **Keep** `**markRead(threadId)`** as a **public method** on the adapter (already useful); optionally alias `**sendReadReceipt`** naming for clarity in our codebase **without** breaking upstream naming — **wrapper in our server package** is acceptable.

**Note:** The core `**chat`** package may or may not expose a first-class `**thread.markRead()`** — **verify** during implementation. If **only** the adapter can mark read, **ALTERED** uses `**getAlteredChat().getAdapter("sendblue")`** (or equivalent **singleton** accessor) **typed as Sendblue adapter** and calls `**markRead`** after our policy says so (e.g. after posting a reply, or never).

### 4.4 Official Sendblue TypeScript SDK

- Audit each HTTP path: `**messages.list`**, `**messages.send`**, `**mark-read**`, reactions, typing — prefer `**sendblue@3.8.0**` (or whatever version we pin) **methods** where they exist.
- Centralize **raw** calls that lack SDK coverage in **one internal module** inside the fork (`sendblueRaw.ts` or similar) so **auth, base URL, and logging** stay consistent.

### 4.5 `persistMessageHistory` / adapter options

- If the adapter passes options into `**createSendblueAdapter`**, document interaction with `**Chat`** `**persistMessageHistory**` — ALTERED may set `**false**` or avoid appending if we want zero Chat-side history writes (depends on `**chat**` version; verify flag exists on `**Chat` constructor** when implementing).

---

## 5. ALTERED repo: surface wiring

### 5.1 Handler registration (`packages/server-experimental`)

**Target shape:**

- `**onDirectMessage`:** all **1:1** product logic (reply, logging, **optional `markRead`** after reply, persistence to Drizzle when that lands).
- `**onNewMention` / `onSubscribedMessage`:** **groups only** for v1 (after adapter fixes). Remove redundant duplicate registration on the same function once **DM path is proven**.

Rename registration helper if desired (e.g. `**registerImessageChatEventHandlers`**) — **cosmetic**, do in the same commit as routing cleanup to avoid churn.

### 5.2 Explicit read receipts

- After `**getAlteredChat()`** resolves the Sendblue adapter, expose a tiny helper, e.g. `**markThreadRead(thread: Thread)`** that **decodes** `thread.id` and calls `**adapter.markRead(thread.id)`** — keeps handlers readable and centralizes policy (**when** to mark read).

### 5.3 Webhook route (`@altered/api-experimental`)

- Keep `**waitUntil`** for **async work** (AI, DB writes) per deployment constraints; **read receipts** become an **explicit** call inside the handler chain, **not** a hidden adapter side effect.

---

## 6. Owned history: Drizzle schema and file layout

### 6.1 Location (locked)

All Drizzle **connection**, **schemas**, and **feature tables** live under `**@altered/server-experimental`**, not a separate `@altered/db` package for this phase.

**Suggested tree (illustrative):**

```text
packages/server-experimental/src/
  database/
    connection.ts          # create pool / drizzle client (Postgres URL from env)
    schema.ts              # re-export merge of chat + auth + …
  chat/
    storage/               # or tables/
      conversations.ts     # drizzle table defs
      messages.ts
    ...                    # repositories / queries as needed
```

- `**import**` table defs into the package-level `**db**` folder for **relations**, `**drizzle-kit` push** config, and **mergeSchema** with Better Auth / sendblue plugin tables per `**imessage-server-poc.md`**.

### 6.2 Identity model

- **Internal ids:** **Nanoid** for primary keys on **conversation** and **message** rows (and any join tables).
- `**external_id`:** optional string, **unique per conversation scope** where applicable — store Sendblue `**message_handle`** when available for **inbound**; for **outbound**, fill when `**postMessage`** / SDK returns an id (may require **second update** after send).

### 6.3 Minimal v1 tables (forward-compatible)

Design for **future** platforms (Instagram DMs, etc.) and **backfill**:

**Conversations (or threads)**

- `id` (nanoid, PK)
- `created_at`, `updated_at`
- **Platform addressing:** e.g. `provider` enum/string (`sendblue`, …), `external_thread_key` **or** normalized fields — **at minimum** store the **Chat SDK thread id** string we already use (`sendblue:…`) in a `**sdk_thread_id`** or `**platform_thread_id`** column for **correlation** with webhooks.
- Optional: `title`, `metadata` jsonb — **omit until needed**.

**Messages**

- `id` (nanoid, PK)
- `conversation_id` (FK → conversations.id)
- `created_at`
- `**content`** — `text` (plain UTF-8); **no MDAST** in v1.
- `**role`** or `**direction`** — if we avoid the name `**direction`**, use `**role**` (`user` | `assistant` | `system`) **or** `sender_kind` — **pick one** and stay consistent with AI SDK expectations. (User preference: **content-only**; **role** is still useful for model replay without inferring from inbound/outbound flags.)
- `**external_id`** — nullable; Sendblue message handle when known.
- Optional: `raw_payload` jsonb **behind a flag** or omit for privacy/size — **defer** unless debugging requires it.

**Indexes**

- `(conversation_id, created_at)` for **history fetch**.
- **Unique** `(conversation_id, external_id)` where `**external_id` is not null** for **dedupe**.

### 6.4 Drizzle workflow

- `**pnpm db:push`** per `?.,m *AGENTS.md`** for experimental iteration.
- **Env:** reuse `**DATABASE_URL`** (or the name already used in `**server-experimental`** / `**api-experimental`**).

### 6.5 Relation to old ALTERED repo

- Inspect `**/Users/inducingchaos/Workspace/containers/altered/**` for naming cadence (`snake_case` columns, timestamp conventions, soft-delete patterns). **Align** where it improves continuity; **improve** where the old schema was debt (user permits suggesting better names before blind copy).

---

## 7. Using owned history with the Chat SDK (no double truth)

### 7.1 Write path

- Inside `**onDirectMessage`** / group handlers: on each inbound `**Message`**, **insert** a row (`role: user`, `content` from `message.text` / normalized markdown plain text).
- After `**thread.post`** / outbound send completes, **insert** assistant row with `**external_id`** from adapter return when available.

### 7.2 Read path for AI

- **Query** Drizzle by `**conversation_id`** ordered by `**created_at`** ascending.
- **Do not** call `**thread.refresh()`** or iterate `**thread.messages`** for **default** LLM context — those hit **platform** APIs and/or Chat cache with **different** semantics.

### 7.3 Optional platform backfill

- **Separate** operation: call Sendblue `**messages.list`** (via adapter `**fetchMessages`** or SDK) with explicit limits for **historical import** into `**external_id`**-deduped rows — **not** on every reply.

### 7.4 Chat SDK “cache” waste

- If `**persistMessageHistory`** still appends to Redis keys `**msg-history:*`**, monitor memory; later **disable** or patch. **Not blocking** v1 if writes are small.

---

## 8. AI bridge: LMS V3 / AI SDK v6

### 8.1 Responsibility

- Implement **pure functions**: `**toAiSdkMessages(rows): ModelMessage[]`** (exact type names per installed **AI SDK v6**).
- Map `**role` + `content`**; **strip** or **fold** unsupported fields.
- **Reverse** is usually unnecessary for persistence (we store **our** shape); **tool calls** / **parts** — **defer** until tool-using agents land; v1 is **plain text** chat.

### 8.2 Placement

- `**packages/server-experimental/src/chat/ai/`** (or `**bridge/`**) — no dependency from `**core-experimental`** on AI if we can avoid it; **api-experimental** may orchestrate **Effect** + AI later per `**imessage-server-poc.md`**.

---

## 9. Concurrency, ordering, and “split brain”

- **Webhook serialization:** Sendblue may deliver **out-of-order** events; **our** table should use `**created_at`** from **provider timestamp** when trustworthy (`Message.metadata.dateSent` / raw payload), not only `**now()`**.
- **Chat SDK locking:** Redis **locks** protect **handler execution** per thread — **current message** still comes from **this** webhook’s `**parseMessage`**. Our inserts should not rely on `**thread.messages`** mid-flight.
- **Dedupe:** use `**external_id`** unique constraint when handle exists; optional `**dedupe:*`** keys in Redis already used by Chat SDK — **do not disable** without understanding **replay** behavior.

---

## 10. Execution order and commit discipline

Aligns with user-confirmed ordering:


| Phase | Contents                                                                                     | Commit style                                               |
| ----- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| A     | Fork adapter: `**isDM`**, `**isMention`**, **markRead optionalization**, SDK consolidation   | One or more **small** commits on fork; pin SHA in monorepo |
| B     | ALTERED: **git dep**, **handler routing**, **explicit read receipt** helper, remove DM hacks | **Minimal** commits per concern                            |
| C     | AI POC (existing plan): **reply** path                                                       | Separate commit                                            |
| D     | Drizzle **conversations/messages**, insert from handlers                                     | Separate commit                                            |
| E     | **AI bridge** + wire **Drizzle → model**                                                     | Separate commit                                            |


**Prefer** many **small** PR-sized commits over one giant dump — matches `**AGENTS.md`** review cadence.

---

## 11. Future compatibility and optional larger forks

- **Upstream merge:** when `**isDM` / `isMention` / markRead** land, **switch** dependency from git fork to **npm** version range.
- **Chat SDK fork** — revisit only if: wasted **msg-history** writes become costly, or **dispatch** cannot support **DM-without-subscribe** cleanly.
- **Multi-platform:** keep `**provider`** + `**sdk_thread_id`** / `**external_id`** columns **generic** so Instagram / Slack rows share the same **query + bridge** patterns.
- **Effect services (mid-term):** db access and Sendblue operations become **Effect** layers constructed from `**api-experimental`** — **do not** block v1 on Effect extraction; **design** functions so extraction is mostly **file moves**.

---

## 12. Verification checklist (before closing the slice)

- **1:1** inbound → `**onDirectMessage`** fires **without** `subscribe()` (logged or tested).
- **Group** thread → `**onSubscribedMessage`** after `**subscribe()`** when that is the intended product behavior.
- `**isMention`** only when @ rules say so — **not** every inbound.
- **Read receipt** only when **app** calls `**markRead`**, never accidentally on every webhook.
- **Drizzle** rows appear for **user** and **assistant** turns; `**external_id`** populated when handles exist.
- **LLM** uses **Drizzle-backed** history via **bridge**, not `**thread.messages`** by default.

---

## 13. References (external)

- Chat SDK docs: **subscribe / unsubscribe**, **handling events**, **routing** — `https://chat-sdk.dev/docs/` (threads, handlers).
- Sendblue HTTP / SDK — official packages and OpenAPI as pinned in fork.

---

## 14. Related plans

- `**[imessage-server-poc.md](file:///Users/inducingchaos/Workspace/containers/altered-4200/.context/_generated/plans/imessage-server-poc.md)`** — vertical scaffold; **must read** this file when implementing **adapter + history + AI** details.
- `**[monorepo-architecture.md](file:///Users/inducingchaos/Workspace/containers/altered-4200/.context/_generated/plans/monorepo-architecture.md)`** — package boundaries and import rules.

